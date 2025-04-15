import { PrismaClient } from '@prisma/client';
import sampleUsers from './users';

async function main() {
  const prisma = new PrismaClient();

  await prisma.user.createMany({ data: sampleUsers.users });

  console.log('states seeded successfully');
}

main();
