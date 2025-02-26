'use server';

import { rideItem } from '@/types';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { insertRideSchema, rideItemSchema } from '../validators';

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

export async function getMyRides() {
  try {
    // Check for user authentication
    const session = await auth();
    if (!session) throw new Error('User not found.');
    const userId = session?.user?.id as string;

    // Get user rides from database
    const userRides = await prisma.user_ride.findMany({
      where: { user_id: userId },
      include: {
        ride: true, // Include ride details
      },
    });

    if (!userRides.length) {
      return {
        success: false,
        message: 'No rides found for this user.',
        rides: [],
      };
    }

    // Convert rides to a plain object array
    return {
      success: true,
      rides: userRides.map((userRide) => ({
        ride_id: userRide.ride.ride_id,
        slug: userRide.ride.slug,
        staticMapUrl: userRide.ride.staticMapUrl,
        shortDescription: userRide.ride.shortDescription,
        date: userRide.ride.date,
        distance: userRide.ride.distance,
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
      rides: [],
    };
  }
}
