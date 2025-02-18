import type { TRPCRouterRecord } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";

import { w3Logger } from "@acme/lib/tools";

import { aiAgent } from "../request/apiService";
import { protectedProcedure } from "../trpc";

export const userRouter = {
  /**
   * update user info
   */
  chat: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        type: z.enum(["image/png", "image/jpg", "image/jpeg"]).optional(),
        imageData: z.string().optional(),
        questId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sessionUserId = ctx.session.user.id;
      if (!sessionUserId) {
        return { text: "No Access" };
      }

      const message = (await aiAgent(sessionUserId, input))[0];
      let airdrop = null;
      if (message?.action == "COMFORT") {
        const comfort = () => {
          const rand = Math.random() * 100;
          if (rand < 50) {
            // 50%
            return 0;
          } else if (rand < 75) {
            // 25%
            return Math.floor(Math.random() * 51); // 0 - 50
          } else if (rand < 90) {
            // 15%
            return Math.floor(Math.random() * 101) + 50; // 50 - 150
          } else {
            // 10%
            return Math.floor(Math.random() * 51) + 150; // 150 - 200
          }
        };
        const result = comfort();
        airdrop = { value: result };
      }
      const quest = await ctx.db.quest.findUnique({
        where: { id: input.questId },
      });

      const questConfig = quest?.config as { pot: number };
      const data = {
        text: message?.text,
        airdrop,
        eventId: "",
        currentPot: questConfig.pot,
      };
      if (airdrop?.value) {
        try {
          data.currentPot = data.currentPot - airdrop.value;
          const event = ctx.db.events.create({
            data: {
              rowKey: `${sessionUserId}_${dayjs().format("YYYY_MM_DD_HH_mm_ss")}`,
              level: "INFO",
              name: "AIRDROP",
              content: { input, resp: { text: message?.text, airdrop } },
              target: "AGENT",
              userId: sessionUserId,
            },
          });
          const updatePoints = ctx.db.userProfile.update({
            //mission rewards
            where: {
              userId: sessionUserId,
            },
            data: {
              points: {
                increment: airdrop.value,
              },
            },
          });
          const updatePool = ctx.db.quest.update({
            where: { id: input.questId },
            data: {
              config: {
                ...questConfig,
                pot: data.currentPot,
              },
            },
          });
          const results = await ctx.db.$transaction([
            event,
            updatePoints,
            updatePool,
          ]);
          data.eventId = results[0].id;
        } catch (error) {
          w3Logger.error(error);
        }
      }
      return data;
    }),
  /**
   * update user info
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        nickName: z.string().optional(), // Alec,
        avatar: z.string().optional(), // 。,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { nickName, avatar } = input;
      const sessionUserId = ctx.session.user.id;
      if (!sessionUserId) {
        return null;
      }
      const data = nickName ? { nickName } : { avatar };
      const result = await ctx.db.userProfile.update({
        where: {
          userId: sessionUserId,
        },
        data,
      });

      return result;
    }),
  /**
   * user Info
   */
  meProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    if (!userId) {
      w3Logger.warn(`User with id ${userId} not found`);
      return null;
    }

    const linedAccount: {
      twitter?: string | null;
      discord?: string | null;
      wallet?: string | null;
      telegram?: string | null;
    } = {};

    const accounts = await ctx.db.account.findMany({
      select: {
        provider: true,
        id_token: true,
        providerAccountId: true,
      },
      where: { userId },
    });

    if (!accounts.length) {
      w3Logger.warn(`User with id ${userId} not found`);
      return null;
    }

    for (const ac of accounts) {
      switch (ac.provider) {
        case "twitter":
          linedAccount.twitter = ac.id_token;
          break;
        case "discord":
          linedAccount.discord = ac.id_token;
          break;
        case "wallet":
          linedAccount.wallet = ac.id_token;
          break;
        case "telegram":
          linedAccount.telegram = ac.id_token;
          break;
      }
    }

    const profile = await ctx.db.userProfile.findUnique({
      select: {
        nickName: true,
        points: true,
        referralCode: true,
        avatar: true,
        role: true,
      },
      where: { userId },
    });

    return { ...profile, linedAccount };
  }),
} satisfies TRPCRouterRecord;
