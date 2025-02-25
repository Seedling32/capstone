'use server';

import { rideItem } from '@/types';

export async function addRideToUserRide(data: rideItem) {
  return {
    success: true,
    message: 'Ride added to user rides.',
  };
}
