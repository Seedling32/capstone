'use server';

import { signInFormSchema, signUpFormSchema } from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';

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

// Sign up user
export async function signUpUser(
  prevState: unknown,
  values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
) {
  try {
    const user = signUpFormSchema.parse({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
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
