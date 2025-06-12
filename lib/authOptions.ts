import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    jisid: string;
    role: "ADMIN" | "STUDENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    jisid: string;
    role: "ADMIN" | "STUDENT";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        jisid: { label: "JIS ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.jisid || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              jisid: credentials.jisid,
            },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            jisid: user.jisid,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jisid = user.jisid;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).jisid = token.jisid as string;
        (session.user as any).role = token.role as "ADMIN" | "STUDENT";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
