import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const bodySchema = z.object({
  weights: z.record(z.string(), z.number().int().min(0).max(99)),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.format() }, { status: 400 });
    }

    const { weights } = parsed.data;

    const position = await prisma.position.findUnique({
      where: { code },
    });

    if (!position) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 });
    }

    // Update or create weights for each stat
    for (const [statCode, weight] of Object.entries(weights)) {
      const stat = await prisma.stat.findUnique({ where: { code: statCode } });
      if (!stat) continue;

      await prisma.positionStatWeight.upsert({
        where: {
          positionId_seasonId_statCode: {
            positionId: position.id,
            seasonId: '',
            statCode,
          },
        },
        update: { weight },
        create: {
          positionId: position.id,
          statCode,
          weight,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating weights:', error);
    return NextResponse.json({ error: 'Failed to update weights' }, { status: 500 });
  }
}