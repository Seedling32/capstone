import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { NextAuthConfig } from 'next-auth';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.userId,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
              image: user.image,
              locationId: user.locationId,
            };
          }
        }

        // If user does not exist or password does not match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set user ID from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.locationId = token.locationId;

      // If there is an update, set user name
      if (trigger === 'update') {
        session.user.name = user.name;
        session.user.locationId = user.locationId;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;
        token.image = user.image;
        token.locationId = user.locationId;

        // If user has no name then use email
        if (user.firstName === 'NO_FIRST_NAME') {
          token.name = user.email!.split('@')[0];

          // Update database to reflect token name
          await prisma.user.update({
            where: { userId: user.id },
            data: { firstName: token.name },
          });
        }
      }

      // Handle session updates
      if (session?.user?.name && trigger === 'update') {
        console.log(session.user.name);

        token.name = session.user.name;
        token.locationId = session.user.locationId;
      }

      return token;
    },
    authorized({ request, auth }: any) {
      // Array of regex patterns of paths to protect
      const protectedPaths = [/\/user\/(.*)/, /\/admin/];

      // Get pathname from the request URL object
      const { pathname } = request.nextUrl;

      // Check if user not authenticated and accessing a  protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        return false;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
