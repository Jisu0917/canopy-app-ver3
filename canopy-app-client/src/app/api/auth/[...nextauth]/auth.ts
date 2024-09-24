import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// Custom types
interface CustomUserProperties {
  user_id: string;
}

// Type augmentation for next-auth
declare module "next-auth" {
  interface User extends CustomUserProperties {}
  interface Session {
    user: User & CustomUserProperties;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUserProperties {}
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user_id: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials
      ): Promise<(User & CustomUserProperties) | null> {
        if (!credentials?.user_id || !credentials?.password) {
          return null;
        }

        const buyer = await prisma.buyer.findUnique({
          where: { user_id: credentials.user_id },
        });

        if (
          !buyer ||
          !(await bcrypt.compare(credentials.password, buyer.password))
        ) {
          return null;
        }

        return {
          id: buyer.id.toString(),
          user_id: buyer.user_id,
          name: buyer.supervisor_name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.user_id = token.user_id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
