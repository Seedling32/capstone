'use server';

import {
  signInFormSchema,
  signUpFormSchema,
  updateUserRideStatusSchema,
  updateUserSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully.' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password.' };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Cloudfare Turnstile token validation
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    }
  );

  const data = await res.json();
  return data.success;
}

// Sign up user
export async function signUpUser(
  prevState: unknown,
  values: {
    firstName: string;
    lastName: string;
    email: string;
    locationId: number;
    password: string;
    confirmPassword: string;
    captchaToken: string;
  }
) {
  const isHuman = await verifyTurnstile(values.captchaToken);

  if (!isHuman) {
    return {
      success: false,
      message: 'CAPTCHA validation failed. Please try again.',
    };
  }
  try {
    const user = signUpFormSchema.parse({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      locationId: values.locationId,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        locationId: user.locationId,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: 'User registered successfully.',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// Update user profile
export async function updateProfile(user: {
  firstName: string;
  lastName: string;
  email: string;
  locationId: number | null;
  image: string | null;
}) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { userId: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found.');

    await prisma.user.update({
      where: { userId: currentUser.userId },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        locationId: user.locationId,
        image: user.image,
      },
    });

    return {
      success: true,
      message: 'User updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Change the status of a user ride
export async function changeUserRideStatus(
  data: z.infer<typeof updateUserRideStatusSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated.');

    // Validate and store the new status
    const status = updateUserRideStatusSchema.parse({
      ...data,
    });

    // Get the ride that is being updated
    const ride = await prisma.user_ride.findFirst({
      where: { user_ride_id: status.userRideId },
    });
    if (!ride) throw new Error('Ride not found.');

    await prisma.user_ride.update({
      where: { user_ride_id: status.userRideId },
      data: {
        status: status.status,
      },
    });

    revalidatePath(`/user/my-rides/${status.userRideId}`);

    return {
      success: true,
      message: 'Status updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.userWhereInput =
    query && query !== 'all'
      ? {
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
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Get user by userId
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { userId: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { userId: id },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        locationId: user.locationId,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
