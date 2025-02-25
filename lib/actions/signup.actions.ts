'use server';

import { rideItem } from '@/types';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { insertRideSchema, rideItemSchema } from '../validators';

export async function addRideToUserRide(data: rideItem) {
  try {
    // Check for user
    const session = await auth();
    const userId = session?.user?.userId as string;
    if (!session) throw new Error('User not found.');

    // Parse and validate the requested ride
    const getRide = rideItemSchema.parse(data);

    // Find ride in database
    const ride = await prisma.ride.findFirst({
      where: { ride_id: getRide.ride_id },
    });

    if (!ride) throw new Error('Ride not found');

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
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyRides() {
  // Check for user
  const session = await auth();
  const userId = session?.user?.userId as string;
  if (!session) throw new Error('User not found.');

  // Get user rides from database
  const rides = await prisma.user_ride.findMany({
    where: { user_id: userId },
  });

  if (!rides) return undefined;

  return convertToPlainObject(rides);
}
