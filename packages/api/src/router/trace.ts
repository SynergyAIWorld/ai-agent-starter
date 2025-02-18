import type { TRPCRouterRecord } from "@trpc/server";

import { EventsZodSchema } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";
import { PageConditionSchema } from "../validators";

export const traceRouter = {
  traceLogPage: protectedProcedure
    .input(PageConditionSchema.merge(EventsZodSchema.partial()))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const where = {
        name,
      };
      const data = await ctx.db.events.findMany({
        where,
        skip: input.start,
        take: input.size,
        orderBy: { createdAt: "desc" },
      });
      const total = await ctx.db.events.count({ where });
      return { data, total };
    }),
} satisfies TRPCRouterRecord;
