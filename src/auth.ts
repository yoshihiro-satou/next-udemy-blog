// src/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import bcryptjs from 'bcryptjs';

async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ここに「登録直後バイパス」を追加（これが超重要！）
        if (credentials?.password === 'MAGIC_BYPASS_2025') {
          const user = await getUser(credentials.email as string);
          if (user) {
            // セッションに渡す形に整形
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          }
          return null;
        }

        // 通常のログインフロー（これまで通り）
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcryptjs.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  // セッションにidを確実に含める（大事）
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
