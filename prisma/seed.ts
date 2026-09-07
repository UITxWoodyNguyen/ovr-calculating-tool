import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const seedPath = path.join(__dirname, '..', 'packages', 'data', 'seed', 'position-weights.json');
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  console.log('📝 Seeding stats...');
  for (const statDef of seedData.statDefinitions) {
    await prisma.stat.upsert({
      where: { code: statDef.code },
      update: { nameVi: statDef.nameVi, category: statDef.category },
      create: { code: statDef.code, nameVi: statDef.nameVi, category: statDef.category },
    });
  }

  console.log('📝 Seeding default season...');
  const baseSeason = await prisma.season.upsert({
    where: { code: 'base' },
    update: { nameVi: 'Cơ bản (mặc định)', sourceSiteCode: 'base' },
    create: { code: 'base', nameVi: 'Cơ bản (mặc định)', sourceSiteCode: 'base' },
  });

  console.log('📝 Seeding positions...');
  for (const pos of seedData.positions) {
    const position = await prisma.position.upsert({
      where: { code: pos.code },
      update: { nameVi: pos.nameVi, groupLabel: pos.groupLabel },
      create: { code: pos.code, nameVi: pos.nameVi, groupLabel: pos.groupLabel },
    });

    for (const [statCode, weight] of Object.entries(pos.stats)) {
      const stat = await prisma.stat.findUnique({ where: { code: statCode } });
      if (!stat) {
        console.warn(`⚠️ Stat ${statCode} not found, skipping`);
        continue;
      }
      
      await prisma.positionStatWeight.upsert({
        where: {
          positionId_seasonId_statCode: {
            positionId: position.id,
            seasonId: baseSeason.id,
            statCode,
          },
        },
        update: { weight: weight as number },
        create: {
          positionId: position.id,
          seasonId: baseSeason.id,
          statCode,
          weight: weight as number,
        },
      });
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });