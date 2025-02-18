import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../trpc";
import { Configuration, PageConditionSchema } from "../validators";

export const adminRouter = {
  settingPage: protectedProcedure
    .input(PageConditionSchema)
    .mutation(async ({ ctx, input }) => {
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
} satisfies TRPCRouterRecord;
