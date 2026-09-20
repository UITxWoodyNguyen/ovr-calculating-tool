import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { optimizeTraining } from '@/lib/optimizer/optimizer';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const bodySchema = z.object({
  statValues: z.array(z.object({
    statCode: z.string(),
    value: z.number().int().min(1).max(99),
  })),
  positionCode: z.string(),
  seasonId: z.string().optional(),
  plan: z.array(z.object({
    statCode: z.string(),
    pointsAdded: z.number().int().min(1).max(2),
  })).optional(),
  question: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.format() }, { status: 400 });
    }

    const { statValues, positionCode, seasonId, plan, question } = parsed.data;

    const position = await prisma.position.findUnique({
      where: { code: positionCode },
      include: {
        weights: {
          where: seasonId ? { seasonId } : { seasonId: null },
          include: { stat: true },
        },
      },
    });

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    const weights: Record<string, number> = {};
    const statNames: Record<string, string> = {};
    for (const w of position.weights) {
      weights[w.statCode] = w.weight;
      statNames[w.statCode] = w.stat.nameVi;
    }

    let optimizationResult;
    if (plan && plan.length > 0) {
      const baseValues: Record<string, number> = Object.fromEntries(statValues.map(s => [s.statCode, s.value]));
      const newValues: Record<string, number> = { ...baseValues };
      for (const p of plan) {
        newValues[p.statCode] = (baseValues[p.statCode] || 0) + p.pointsAdded;
      }
      const baseOvr = calculateOVRSimple(baseValues, weights);
      const optimizedOvr = calculateOVRSimple(newValues, weights);
      optimizationResult = {
        baseOvr,
        optimizedOvr,
        ovrGain: optimizedOvr - baseOvr,
        plan,
        trainingsUsed: plan.reduce((sum, p) => sum + p.pointsAdded, 0),
        statsTrained: plan.length,
        alternatives: [],
      };
    } else {
      optimizationResult = optimizeTraining(statValues, weights);
    }

    const statList = statValues.map(s => 
      `- ${statNames[s.statCode] || s.statCode}: ${s.value} (hệ số: ${weights[s.statCode] || 0})`
    ).join('\n');

    const planText = optimizationResult.plan.length > 0
      ? optimizationResult.plan.map(p => 
          `+${p.pointsAdded} ${statNames[p.statCode] || p.statCode}`
        ).join(', ')
      : 'Không đào tạo thêm';

    const systemPrompt = `Bạn là chuyên gia FIFA Online 4, giúp người chơi tối ưu hóa đào tạo cầu thủ.
Công thức OVR: Trung bình cộng có trọng số (weighted average) = Tổng(chỉ số × hệ số) / Tổng hệ số, làm tròn.

Dữ liệu cầu thủ:
${statList}

Vị trí: ${position.nameVi} (${positionCode})
OVR gốc: ${optimizationResult.baseOvr}
OVR sau tối ưu: ${optimizationResult.optimizedOvr} (+${optimizationResult.ovrGain})
Phương án đề xuất: ${planText}
Số lượt đào tạo: ${optimizationResult.trainingsUsed}
Số chỉ số đào tạo: ${optimizationResult.statsTrained}

Quy tắc tie-break: Ưu tiên OVR cao nhất → ít lượt đào tạo hơn → ít chỉ số hơn.
Hãy giải thích bằng tiếng Việt tự nhiên, dễ hiểu.`;

    const userPrompt = question 
      ? `Người dùng hỏi: "${question}". Hãy trả lời dựa trên dữ liệu trên.`
      : 'Hãy giải thích tại sao phương án đào tạo này là tối ưu, và tại sao không chọn các chỉ số khác.';

    const result = await model.generateContent({
      systemInstruction: systemPrompt,
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const text = result.response.text();

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error('Error generating AI explanation:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}

function calculateOVRSimple(statValues: Record<string, number>, positionWeights: Record<string, number>): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const [statCode, value] of Object.entries(statValues)) {
    const weight = positionWeights[statCode] ?? 0;
    if (weight > 0) {
      weightedSum += value * weight;
      totalWeight += weight;
    }
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}