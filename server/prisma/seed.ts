import 'dotenv/config';
import { prisma } from '@/db/prisma';
// The 25 official Iloilo City jeepney loops (ELPTRP); see README for sources.
import routes from './data/routes.json';

async function main() {
  console.log(`Seeding ${routes.length} routes...`);

  for (const { segments, stops: _stops, turnIndex: _turnIndex, localNames: _localNames, ...routeData } of routes) {
    await prisma.route.upsert({
      where: { routeNumber: routeData.routeNumber },
      update: {
        ...routeData,
        segments: { deleteMany: {}, create: segments },
      },
      create: {
        ...routeData,
        segments: { create: segments },
      },
    });
  }

  const total = await prisma.route.count();
  console.log(`Done. ${total} routes in the database.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
