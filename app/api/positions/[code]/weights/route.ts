import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');

    const position = await prisma.position.findUnique({
      where: { code },
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

    return NextResponse.json({
      position: { code: position.code, nameVi: position.nameVi },
      weights,
    });
  } catch (error) {
    console.error('Error fetching position weights:', error);
    return NextResponse.json({ error: 'Failed to fetch position weights' }, { status: 500 });
  }
}