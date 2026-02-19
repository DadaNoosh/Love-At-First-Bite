import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const loginSchema = z.object({ password: z.string().min(1) });

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: { password: {} },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        if (parsed.data.password !== process.env.APP_PASSWORD) return null;
        return { id: 'ops-user', name: 'Ops User' };
      }
    })
  ],
  pages: { signIn: '/login' },
  secret: process.env.AUTH_SECRET
});
