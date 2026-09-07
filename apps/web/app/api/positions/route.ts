import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: {
        weights: {
          where: { seasonId: null },
          include: { stat: true },
        },
      },
      orderBy: { code: 'asc' },
    });

    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 });
  }
}