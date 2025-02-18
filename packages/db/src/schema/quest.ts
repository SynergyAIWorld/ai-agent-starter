import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const QuestZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullish(),
  desc: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  config: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.number().int(),
  parentQuestId: z.string().nullish(),
});
