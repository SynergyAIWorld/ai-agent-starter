import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";
import { Configuration, PageConditionSchema } from "../validators";

export const settingRouter = {
  getSetting: protectedProcedure
    .input(Configuration)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.configuration.findUnique({
        where: {
          id: input.id ?? 0,
        },
      });
      return { data };
    }),
  settingPage: protectedProcedure
    .input(PageConditionSchema)
    .query(async ({ ctx, input }) => {
      const where = {
        status: input.status,
      };
      const data = await ctx.db.configuration.findMany({
        where,
        skip: input.start,
        take: input.size,
      });

      const total = await ctx.db.configuration.count({ where });
      return { data, total };
    }),

  settingMintOrUpdate: protectedProcedure
    .input(Configuration)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) {
        return null;
      }
      const result = await ctx.db.configuration.upsert({
        where: {
          id: input.id ?? 0,
        },
        update: {
          ...input,
        },
        create: {
          ...input,
          belong: userId,
        },
      });
      return result;
    }),

  getSettingByKey: protectedProcedure
    .input(z.object({ key: z.string(), type: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const data = await ctx.db.configuration.findUnique({
        where: {
          key_belong: {
            key: input.key,
            belong: userId ? userId : "app",
          },
        },
      });
      return { data };
    }),
} satisfies TRPCRouterRecord;
