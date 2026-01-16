import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;

          // Se o usuário não tiver senha (login social), retorna null
          if (!user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks, // Keep authorized callback
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Remove large image data from token to prevent header overflow
        delete token.picture;
        delete token.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      // Buscar dados atualizados do usuário (como saldo, role e bio)
      if (session.user.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, balance: true, image: true, bio: true, situation: true },
          });

          if (user) {
            session.user.role = user.role;
            session.user.balance = user.balance;
            session.user.image = user.image;
            // Campos adicionais para a experiência do usuário
            // @ts-expect-error campos extras no objeto user da sessão
            session.user.bio = user.bio;
            // @ts-expect-error campos extras no objeto user da sessão
            session.user.situation = user.situation;
          }
        } catch (e) {
          console.error("Error fetching user session details", e);
        }
      }
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
