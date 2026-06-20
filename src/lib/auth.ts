import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { env } from "./env";

/**
 * NextAuth (Credentials) config. JWT sessions are required for the Credentials
 * provider. The Prisma adapter persists users/accounts. Third-party OAuth can
 * be added behind env flags for production without changing the rest of the app.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, attach role/plan. On subsequent calls, refresh from DB so
      // plan upgrades (Stripe) and role changes propagate.
      const userId = (user?.id as string) ?? (token.sub as string);
      if (userId) {
        const dbUser = await db.user.findUnique({ where: { id: userId } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.plan = (token.plan as string) ?? "FREE";
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
