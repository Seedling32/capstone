import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  export interface Session {
    user: {
      role: string;
      image: string | null;
    } & DefaultSession['user'];
  }
}
