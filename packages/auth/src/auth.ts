import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { NextRequest } from "next/server";
import { skipCSRFCheck } from "@auth/core";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { getServerSession } from "next-auth";

import { db } from "@acme/db/client";

import { env } from "./env";
import { providers, siwe } from "./providers";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
const adapter = PrismaAdapter(db) as Adapter;

export const isSecureContext = env.NODE_ENV == "production";

export const authOptions: NextAuthOptions = {
  debug: env.NODE_ENV !== "production",
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, trigger, user }) {
      if (trigger == "signIn" || trigger == "signUp") {
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    error: "/",
  },
};

export const handlers = async (req: unknown, res: unknown) => {
  const url = (req as NextRequest).url;
  const isDefaultSignInPage = url
    ? new URL(url).pathname.includes("/api/auth/signin")
    : false;
  if (isDefaultSignInPage) {
    authOptions.providers = [...providers];
  } else {
    authOptions.providers = [...providers, siwe(req as NextRequest)];
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(
    req as NextApiRequest,
    res as NextApiResponse,
    authOptions,
  );
};

export const validateToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const getServerAuthSession = () => {
  authOptions.providers = [...providers];
  return getServerSession(authOptions);
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
