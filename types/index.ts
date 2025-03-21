import { z } from 'zod';
import {
  allUserRidesSchema,
  createRideSchema,
  insertRideSchema,
  rideItemSchema,
} from '@/lib/validators';

export type Ride = z.infer<typeof createRideSchema> & {
  ride_id: string;
  createdAt: Date;
  updatedAt: Date;
  path: string;
};
export type UserName = {
  firstName: string;
  lastName: string;
};
export type userRide = z.infer<typeof insertRideSchema>;
export type rideItem = z.infer<typeof rideItemSchema>;
export type getMyRide = {
  rides: rideItem[];
};
export type getUserRide = z.infer<typeof allUserRidesSchema> & {
  ride: Ride;
  user: UserName;
};

export type DynamicMapProps = {
  path: { lat: number; lng: number }[];
  savedRoutes?: { id: number; path: { lat: number; lng: number }[] }[];
  onMapClick?: (event: google.maps.MapMouseEvent) => void;
  zoom?: number;
};
