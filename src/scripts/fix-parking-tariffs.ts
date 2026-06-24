import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.trim().length === 0) {
  throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const tariffs = await prisma.tariff.findMany();

  let updatedCount = 0;

  for (const tariff of tariffs) {
    const newPricePerUnit =
      tariff.pricePerUnit == null || tariff.pricePerUnit <= 0
        ? 1
        : tariff.pricePerUnit;

    const newPricePerDay =
      tariff.pricePerDay == null || tariff.pricePerDay <= 0
        ? 15
        : tariff.pricePerDay;

    const newPricePerMonth =
      tariff.pricePerMonth == null || tariff.pricePerMonth <= 0
        ? 180
        : tariff.pricePerMonth;

    const needsUpdate =
      newPricePerUnit !== tariff.pricePerUnit ||
      newPricePerDay !== tariff.pricePerDay ||
      newPricePerMonth !== tariff.pricePerMonth;

    if (needsUpdate) {
      await prisma.tariff.update({
        where: {
          id: tariff.id,
        },
        data: {
          pricePerUnit: newPricePerUnit,
          pricePerDay: newPricePerDay,
          pricePerMonth: newPricePerMonth,
        },
      });

      updatedCount++;

      console.log(
        `Fixed tariff ${tariff.id} -> unit=${newPricePerUnit}, day=${newPricePerDay}, month=${newPricePerMonth}`,
      );
    }
  }

  console.log(`\nDone. Updated ${updatedCount} tariffs.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });