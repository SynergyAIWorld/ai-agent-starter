import type { TRPCRouterRecord } from "@trpc/server";
import { SiweMessage } from "siwe";
import { z } from "zod";

import { w3Logger } from "@acme/lib/tools";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  secretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  bindTelegram: protectedProcedure
    .input(
      z.object({
        id: z.number(), // 5118514810,
        first_name: z.string().optional(), // Alec,
        last_name: z.string().optional(), // 。,
        username: z.string().optional(), // imalec3000,
        photo_url: z.string().optional(), //https://t.me/i/userpic/320/a2efSGL8KxZXFlSa2I9aQjqiMHMupIN5QFlHaF97_9xSTFRqb1EFhnugWwQfv8qC.jpg,
        auth_date: z.number().optional(), //1721382502,
        hash: z.string().optional(), //e2889d4cadcc0b73038aea2bb3241ff298651298c1a01f18889d2cabeafb7610
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sessionUserId = ctx.session.user.id;
      if (!sessionUserId) {
        return null;
      }
      const result = await ctx.db.account.create({
        data: {
          access_token: input.hash,
          refresh_token: input.hash,
          expires_at: Date.now() / 1000 + 30 * 24 * 60 * 60,
          scope: "write",
          token_type: "account",
          providerAccountId: `${input.id}`,
          provider: "telegram",
          type: "telegramAuth",
          userId: sessionUserId,
          id_token: input.username ?? input.first_name ?? `${input.id}`,
        },
      });
      return result;
    }),

  /**
   * Sign Up
   */
  signUpWithAddress: publicProcedure
    .input(
      z.object({
        message: z.string().min(1), // Alec,
        signature: z.string().min(1), // 。,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { message, signature } = input;
        const siwe = new SiweMessage(message);
        const result = await siwe.verify({
          signature: signature,
        });
        if (!result.success) {
          return null;
        }
        const info = {
          address: siwe.address.toLowerCase(),
          chainId: siwe.chainId,
          ...input,
        };
        const user = await ctx.db.user.findUnique({
          where: {
            email: `${info.address}@wallet`,
          },
        });
        //exist user
        if (user) {
          return info;
        } else {
          //exist account
          const linkedAccount = await ctx.db.account.findUnique({
            include: {
              user: true,
            },
            where: {
              provider_providerAccountId: {
                providerAccountId: info.address,
                provider: "wallet",
              },
            },
          });
          if (linkedAccount?.user) {
            return info;
          }
        }
        //no exist
        let sessionUserId = ctx.session?.user.id;
        let newUser;
        w3Logger.info(sessionUserId);
        if (!sessionUserId) {
          newUser = await ctx.db.user.create({
            data: {
              email: `${info.address}@wallet`,
              name: info.address,
              emailVerified: null,
            },
          });
          await ctx.db.userProfile.create({
            data: {
              nickName: siwe.address.substring(30),
              points: 0,
              userId: newUser.id,
            },
          });
          sessionUserId = newUser.id;
        } else {
          newUser = ctx.session?.user;
        }
        await ctx.db.account.create({
          data: {
            access_token: signature,
            refresh_token: message,
            expires_at: Date.now() / 1000 + 30 * 24 * 60 * 60,
            scope: "login",
            token_type: "nonce",
            providerAccountId: info.address,
            provider: "wallet",
            type: "webauthn",
            userId: sessionUserId,
            id_token: siwe.address,
          },
        });
        return info;
      } catch (error) {
        w3Logger.error(error);
        throw new Error("Unable to connect to the server.");
      }
    }),
} satisfies TRPCRouterRecord;
