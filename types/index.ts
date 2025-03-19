import { z } from 'zod';
import {
  allUserRidesSchema,
  createRideSchema,
  insertRideSchema,
  rideItemSchema,
} from '@/lib/validators';

export type Ride = z.infer<typeof createRideSchema> & {
  ride_id: string;
  slug: string;
  path: string;
  staticMapUrl: string;
  createdAt: Date;
  updatedAt: Date;
  distance: number;
};

export type userRide = z.infer<typeof insertRideSchema>;
export type rideItem = z.infer<typeof rideItemSchema>;
export type getMyRide = {
  rides: rideItem[];
};
export type getUserRide = z.infer<typeof allUserRidesSchema> & {
  ride: Ride;
};
