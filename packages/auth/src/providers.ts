import type { AdapterUser } from "next-auth/adapters";
import type { DiscordProfile } from "next-auth/providers/discord";
import type { TwitterProfile } from "next-auth/providers/twitter";
import type { NextRequest } from "next/server";
import Credentials from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Twitter from "next-auth/providers/twitter";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

import { db } from "@acme/db/client";

import { env } from "./env";

export const providers = [
  Discord({
    clientId: env.AUTH_DISCORD_ID,
    clientSecret: env.AUTH_DISCORD_SECRET,
    profile(profile: DiscordProfile) {
      if (!profile.avatar) {
        const defaultAvatarNumber =
          profile.discriminator === "0"
            ? Number(BigInt(profile.id) >> BigInt(22)) % 6
            : parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.image_url,
        username: profile.username,
      };
    },
  }),
  Twitter({
    clientId: env.AUTH_TWITTER_ID,
    clientSecret: env.AUTH_TWITTER_SECRET,
    version: "2.0",
    profile({ data }: TwitterProfile) {
      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: `${data.username}@twitter`,
        image: data.profile_image_url,
      };
    },
  }),
];

export const siwe = (req: NextRequest) => {
  return Credentials({
    name: "Wallet SignIn",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0...",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0...",
      },
    },
    async authorize(credentials) {
      try {
        const message = credentials?.message;
        const signature = credentials?.signature;
        if (!message || !signature || signature.length > 132) {
          console.log(
            new Date(),
            `[###AUTH DEBUG] Invalid raw signature,Rec[${signature}]`,
          );
          return null;
        }
        const siwe = new SiweMessage(message);
        const nextAuthUrl = new URL(env.NEXTAUTH_URL);
        const nonce = await getCsrfToken({
          req: { headers: { cookie: req.headers.get("cookie") ?? undefined } },
        });
        if (nonce !== siwe.nonce) {
          console.log(
            new Date(),
            `[###AUTH DEBUG] CSRF DIFF Need[${nonce}],Rec[${siwe.nonce}]`,
          );
        }
        const result = await siwe.verify({
          signature,
          domain: nextAuthUrl.host,
        });

        if (!result.success) {
          return null;
        }
        const address = siwe.address.toLowerCase();
        const user = await db.user.findUnique({
          where: {
            email: `${address}@wallet`,
          },
        });
        let accessUser = null;
        if (!user) {
          const linkedAccount = await db.account.findUnique({
            include: {
              user: true,
            },
            where: {
              provider_providerAccountId: {
                providerAccountId: address,
                provider: "wallet",
              },
            },
          });
          if (linkedAccount?.user) {
            accessUser = { ...linkedAccount.user } as AdapterUser;
          }
        } else {
          accessUser = { ...user } as AdapterUser;
        }
        if (accessUser) {
          await db.account.update({
            where: {
              provider_providerAccountId: {
                provider: "wallet",
                providerAccountId: address,
              },
            },
            data: {
              access_token: signature,
              refresh_token: message,
            },
          });
        }
        return accessUser;
      } catch (e) {
        console.error(new Date(), "###Authorize Error", e);
        return null;
      }
    },
  });
};
