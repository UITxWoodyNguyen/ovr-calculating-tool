import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PlayerData {
  externalId: string;
  name: string;
  seasonCode: string;
  primaryPositionCode: string;
  secondaryPositions: string[];
  stats: Record<string, number>;
  sourceUrl: string;
}

async function ingestFromCSV(csvPath: string) {
  console.log(`📥 Reading CSV from ${csvPath}...`);
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const players: PlayerData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => row[h] = values[idx] || '');
    
    const stats: Record<string, number> = {};
    for (const [key, value] of Object.entries(row)) {
      if (key !== 'externalId' && key !== 'name' && key !== 'seasonCode' && 
          key !== 'primaryPositionCode' && key !== 'secondaryPositions' && key !== 'sourceUrl') {
        const num = parseInt(value);
        if (!isNaN(num)) stats[key] = num;
      }
    }
    
    players.push({
      externalId: row.externalId,
      name: row.name,
      seasonCode: row.seasonCode || 'base',
      primaryPositionCode: row.primaryPositionCode,
      secondaryPositions: row.secondaryPositions ? row.secondaryPositions.split(';') : [],
      stats,
      sourceUrl: row.sourceUrl || `https://vn.fifaaddict.com/fo4db/pid${row.externalId}`,
    });
  }
  
  console.log(`Found ${players.length} players in CSV`);
  
  for (const playerData of players) {
    await upsertPlayer(playerData);
  }
  
  console.log('✅ CSV ingestion completed!');
}

async function upsertPlayer(data: PlayerData) {
  const season = await prisma.season.upsert({
    where: { code: data.seasonCode },
    update: {},
    create: { code: data.seasonCode, nameVi: data.seasonCode, sourceSiteCode: data.seasonCode },
  });

  const position = await prisma.position.findUnique({
    where: { code: data.primaryPositionCode },
  });
  
  if (!position) {
    console.warn(`⚠️ Position ${data.primaryPositionCode} not found, skipping ${data.name}`);
    return;
  }

  const player = await prisma.player.upsert({
    where: { externalId: data.externalId },
    update: {
      name: data.name,
      seasonId: season.id,
      primaryPositionId: position.id,
      secondaryPositionId: data.secondaryPositions[0] || null,
      sourceUrl: data.sourceUrl,
      lastSyncedAt: new Date(),
    },
    create: {
      externalId: data.externalId,
      name: data.name,
      seasonId: season.id,
      primaryPositionId: position.id,
      secondaryPositionId: data.secondaryPositions[0] || null,
      sourceUrl: data.sourceUrl,
      lastSyncedAt: new Date(),
    },
  });

  for (const [statCode, baseValue] of Object.entries(data.stats)) {
    const stat = await prisma.stat.findUnique({ where: { code: statCode } });
    if (!stat) continue;
    
    await prisma.playerStatValue.upsert({
      where: {
        playerId_statCode: {
          playerId: player.id,
          statCode,
        },
      },
      update: { baseValue },
      create: {
        playerId: player.id,
        statCode,
        baseValue,
      },
    });
  }
  
  console.log(`✅ Upserted: ${data.name} (${data.externalId})`);
}

async function ingestFromFifaAddict() {
  console.log('🔍 Attempting to fetch from fifaaddict.com...');
  console.log('⚠️  This requires manual implementation based on actual API endpoints.');
  console.log('   Please check Network tab on https://vn.fifaaddict.com/fo4db to find the API.');
  console.log('   For now, use CSV import with: npm run ingest:players -- --csv=path/to/file.csv');
}

async function main() {
  const args = process.argv.slice(2);
  const csvArg = args.find(a => a.startsWith('--csv='));
  
  if (csvArg) {
    const csvPath = csvArg.replace('--csv=', '');
    await ingestFromCSV(csvPath);
  } else {
    await ingestFromFifaAddict();
  }
}

main()
  .catch((e) => {
    console.error('❌ Ingestion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });