import { PrismaClient } from '@prisma/client';
import states from './states';

async function main() {
  const prisma = new PrismaClient();

  await prisma.state.createMany({ data: states });

  console.log('states seeded successfully');
}

main();
