import { z } from 'zod';

// Schema for creating rides
export const createRideSchema = z.object({
  shortDescription: z
    .string()
    .min(3, 'Short description must be at least 3 characters.'),
  longDescription: z
    .string()
    .min(3, 'Long description must be at least 3 characters.'),
  date: z.coerce.date(),
});

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// Schema for signing users up
export const signUpFormSchema = z
  .object({
    firstName: z.string().min(3, 'First name must be at least 3 characters.'),
    lastName: z.string().min(3, 'Last name must be at least 3 characters.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

// Adding rides schemas for user rides
export const rideItemSchema = z.object({
  ride_id: z.string().min(1, 'Ride is required.'),
  shortDescription: z.string().min(1, 'Ride name is required.'),
  slug: z.string().min(1, 'Ride slug is required.'),
  date: z.coerce.date(),
  staticMapUrl: z.string().min(1, 'Image is required.'),
  distance: z.number(),
});

export const insertRideSchema = z.object({
  userId: z.string(),
  rideId: z.string(),
  status: z.string().optional(),
  dateSignedUp: z.coerce.date().optional(),
  dateCompleted: z.coerce.date().optional().nullable(),
});

// Schema to update user profile
export const updateProfileSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters.'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters.'),
  email: z.string().min(3, 'Email must be at least 3 characters.'),
});
