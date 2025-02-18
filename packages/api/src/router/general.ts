import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";
import { PageConditionSchema } from "../validators";

export const generalRouter = {
  topPtsUser: publicProcedure
    .input(PageConditionSchema)
    .query(async ({ ctx, input }) => {
      const { start, size, status } = input;
      const where = {
        status,
        points: { gt: 0 },
      };
      const data = await ctx.db.userProfile.findMany({
        select: {
          nickName: true,
          points: true,
          avatar: true,
        },
        where,
        skip: start,
        take: size,
        orderBy: { points: "desc" },
      });

      const total = await ctx.db.userProfile.count({ where });
      return { data, total };
    }),

  currentPool: publicProcedure
    .input(PageConditionSchema)
    .query(async ({ ctx, input }) => {
      const { query, status } = input;
      const where = {
        status,
        parentQuestId: null,
        ...query,
      };
      const data = await ctx.db.quest.findFirst({
        where,
        include: {
          subQuests: {
            where: {
              status: 0,
            },
          },
        },
      });
      return { data };
    }),
} satisfies TRPCRouterRecord;
