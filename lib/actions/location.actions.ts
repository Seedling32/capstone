'use server';

import { prisma } from '@/db/prisma';

// Get all states
export async function getAllStates() {
  const states = await prisma.state.findMany();

  return states;
}

// Get location by ID
export async function getLocationById(userLocationId: number) {
  const location = await prisma.location.findFirst({
    where: { id: userLocationId },
    include: {
      state: { select: { abbreviation: true } },
    },
  });

  return {
    city: location?.city,
    stateId: location?.stateId,
  };
}

// Find an existing location or create a new location if not exists
export async function findOrCreateLocation({
  stateId,
  city,
}: {
  stateId: number;
  city: string;
}) {
  // Step 1: Check if location exists
  let location = await prisma.location.findFirst({
    where: {
      stateId,
      city: {
        equals: city,
        mode: 'insensitive',
      },
    },
  });

  // Step 2: Create if not exists
  if (!location) {
    location = await prisma.location.create({
      data: {
        stateId,
        city,
      },
    });
  }

  return location;
}
