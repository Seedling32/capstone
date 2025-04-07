'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import {
  createRideSchema,
  insertRideSchema,
  rideItemSchema,
  updateRideSchema,
} from '../validators';
import { rideItem } from '@/types';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Get rides to display on the ride page.
export async function getLatestRides() {
  const data = await prisma.ride.findMany({
    take: 8,
    orderBy: {
      date: 'desc',
    },
    include: {
      location: {
        select: { city: true },
      },
    },
  });

  return convertToPlainObject(data);
}

// Get all rides
export async function getAllRides({
  query,
  limit = PAGE_SIZE,
  page,
  difficulty,
  distance,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  difficulty?: string;
  distance?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.rideWhereInput =
    query && query !== 'all'
      ? {
          shortDescription: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  // Difficulty filter
  const difficultyFilter =
    difficulty && difficulty !== 'all' ? { difficulty } : {};

  // Distance filter
  const distanceFilter: Prisma.rideWhereInput =
    distance && distance !== 'all'
      ? {
          distance: {
            gte: Number(distance.split('-')[0]),
            lte: Number(distance.split('-')[1]),
          },
        }
      : {};

  const data = await prisma.ride.findMany({
    where: {
      ...queryFilter,
      ...difficultyFilter,
      ...distanceFilter,
    },
    orderBy:
      sort === 'shortest'
        ? { distance: 'asc' }
        : sort === 'longest'
        ? { distance: 'desc' }
        : { date: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user_ride: { where: { status: 'SIGNED_UP' } },
      location: true,
    },
  });

  const dataCount = await prisma.ride.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Get single ride by the slug.
export async function getRideBySlug(slug: string) {
  return await prisma.ride.findFirst({
    where: { slug: slug },
    include: {
      location: true,
    },
  });
}

// Get single ride by ID
export async function getRideById(rideId: string) {
  const data = await prisma.ride.findFirst({
    where: { ride_id: rideId },
  });

  return convertToPlainObject(data);
}

export async function addRideToUserRide(data: rideItem) {
  try {
    // Check for user
    const session = await auth();
    const userId = session?.user?.id as string;
    if (!session) throw new Error('Must be signed in.');

    // Parse and validate the requested ride
    const getRide = rideItemSchema.parse(data);

    // Find ride in database
    const ride = await prisma.ride.findFirst({
      where: { ride_id: getRide.ride_id },
    });

    if (!ride) throw new Error('Ride not found');

    // Check if the ride is already in the user's ride list
    const existingRide = await prisma.user_ride.findFirst({
      where: {
        user_id: userId,
        ride_id: ride.ride_id,
      },
    });

    if (existingRide) {
      return {
        success: false,
        message: 'You are already signed up for this ride.',
      };
    } else {
      const newRide = insertRideSchema.parse({
        userId: userId,
        rideId: ride.ride_id,
      });

      // Add to database
      await prisma.user_ride.create({
        data: {
          user_id: newRide.userId,
          ride_id: newRide.rideId,
        },
      });

      return {
        success: true,
        message: 'Ride added to user rides.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all rides associated with specific user
export async function getMyRides({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  // Check for user authentication
  const session = await auth();
  if (!session) throw new Error('User not found.');
  const userId = session?.user?.id as string;

  // Get user rides from database
  const userRides = await prisma.user_ride.findMany({
    where: { user_id: userId },
    orderBy: { date_signed_up: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      ride: {
        include: {
          location: true,
        },
      },
    },
  });

  const dataCount = await prisma.user_ride.count({
    where: { user_id: userId },
  });

  return {
    userRides,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Get user ride by ID
export async function getUserRideById(userRideId: string) {
  const data = await prisma.user_ride.findFirst({
    where: { user_ride_id: userRideId },
    include: {
      user: { select: { firstName: true, lastName: true } },
      ride: true,
    },
  });

  return convertToPlainObject(data);
}

type RiderDataType = {
  month: string;
  activeUsers: number;
}[];

// Get ride data for admin overview
export async function getRideSummary() {
  // Get counts for resources
  const userRidesCount = await prisma.user_ride.count();
  const totalRidesCount = await prisma.ride.count();
  const usersCount = await prisma.user.count();

  // Get monthly rider engagement
  const riderDataRaw = await prisma.$queryRaw<
    Array<{ month: string; activeUsers: number }>
  >`SELECT to_char("date_signed_up", 'MM/YY') as "month", COUNT(*) as "activeUsers" FROM "user_ride" WHERE "status" = 'SIGNED_UP' GROUP BY "month" ORDER BY "month" DESC`;

  const riderData: RiderDataType = riderDataRaw.map((entry) => ({
    month: entry.month,
    activeUsers: Number(entry.activeUsers),
  }));

  // Get latest rides
  const latestRides = await prisma.user_ride.findMany({
    orderBy: { date_signed_up: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true } },
      ride: {
        select: {
          staticMapUrl: true,
          shortDescription: true,
          date: true,
          slug: true,
        },
      },
    },
    take: 6,
  });

  return {
    userRidesCount,
    totalRidesCount,
    usersCount,
    riderData,
    latestRides,
  };
}

// Get all user rides
export async function getAllUserRides({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.user_rideWhereInput =
    query && query !== 'all'
      ? {
          user: {
            OR: [
              {
                firstName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        }
      : {};

  const data = await prisma.user_ride.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { ride: { date: 'desc' } },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: { select: { firstName: true, lastName: true } },
      ride: {
        select: {
          staticMapUrl: true,
          shortDescription: true,
          date: true,
          slug: true,
        },
      },
    },
  });

  const dataCount = await prisma.user_ride.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a ride
export async function deleteRide(rideId: string) {
  try {
    const rideExists = await prisma.ride.findFirst({
      where: { ride_id: rideId },
    });

    if (!rideExists) throw new Error('Ride not found.');

    await prisma.ride.delete({ where: { ride_id: rideId } });

    revalidatePath('/admin/all-rides');

    return {
      success: true,
      message: 'Ride deleted successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create a ride. Path is passed in separately to stringify before saving.
export async function createNewRide({
  data,
  path,
  elevation,
}: {
  data: z.infer<typeof createRideSchema>;
  path: { lat: number; lng: number }[];
  elevation?: { distance: number; elevation: number }[];
}) {
  try {
    const newRide = createRideSchema.parse(data);

    await prisma.ride.create({
      data: {
        slug: newRide.slug,
        shortDescription: newRide.shortDescription,
        longDescription: newRide.longDescription,
        date: newRide.date,
        staticMapUrl: newRide.staticMapUrl,
        distance: newRide.distance,
        path: JSON.stringify(path),
        elevation: JSON.stringify(elevation),
        locationId: newRide.locationId,
        difficulty: newRide.difficulty,
      },
    });

    return {
      success: true,
      message: 'Ride created successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a ride
export async function updateRide({
  data,
}: {
  data: z.infer<typeof updateRideSchema>;
}) {
  try {
    const newRide = updateRideSchema.parse(data);
    const rideExists = await prisma.ride.findFirst({
      where: { ride_id: newRide.ride_id },
    });

    if (!rideExists) throw new Error('Ride not found');

    await prisma.ride.update({
      where: { ride_id: newRide.ride_id },
      data: newRide,
    });

    return {
      success: true,
      message: 'Ride updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all difficulties
export async function getAllDifficulties() {
  const data = await prisma.ride.groupBy({
    by: ['difficulty'],
    _count: true,
  });

  return data;
}
