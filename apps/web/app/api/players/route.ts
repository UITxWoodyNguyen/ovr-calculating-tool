import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const season = searchParams.get('season');
    const q = searchParams.get('q');

    const where: any = {};

    if (season) {
      where.seasonId = season;
    }

    if (position) {
      where.OR = [
        { primaryPosition: { code: position } },
        { secondaryPositions: { has: position } },
      ];
    }

    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }

    const players = await prisma.player.findMany({
      where,
      include: {
        season: true,
        primaryPosition: true,
        statValues: {
          include: { stat: true },
        },
      },
      orderBy: { name: 'asc' },
      take: 100,
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}