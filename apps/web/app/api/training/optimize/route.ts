import { NextResponse } from 'next/server';
import { z } from 'zod';
import { optimizeTraining } from '@/lib/optimizer/optimizer';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  statValues: z.array(z.object({
    statCode: z.string(),
    value: z.number().int().min(1).max(99),
  })),
  positionCode: z.string(),
  seasonId: z.string().optional(),
  maxStatsToTrain: z.number().int().min(1).max(5).optional().default(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.format() }, { status: 400 });
    }

    const { statValues, positionCode, seasonId, maxStatsToTrain } = parsed.data;

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
    for (const w of position.weights) {
      weights[w.statCode] = w.weight;
    }

    const result = optimizeTraining(statValues, weights, maxStatsToTrain);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error optimizing training:', error);
    return NextResponse.json({ error: 'Failed to optimize training' }, { status: 500 });
  }
}