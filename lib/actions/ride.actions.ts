'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObject } from '../utils';
import { auth } from '@/auth';

// Get rides to display on the ride page.
export async function getLatestRides() {
  const data = await prisma.ride.findMany({
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return convertToPlainObject(data);
}

// Get individual ride details based on the slug.
export async function getRideBySlug(slug: string) {
  return await prisma.ride.findFirst({
    where: { slug: slug },
  });
}

// Get the user's rides
export async function getMyRides({
  limit = 8,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User not authorized');

  const data = await prisma.user_ride.findMany({
    where: { user_id: session?.user?.id },
    orderBy: { date_signed_up: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user_ride.count({
    where: { user_id: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
