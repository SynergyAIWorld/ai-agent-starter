import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const QuestResultZodSchema = z.object({
  id: z.string(),
  questId: z.string(),
  rowKey: z.string(),
  info: jsonSchema,
  result: jsonSchema,
  nonce: z.string().nullish(),
  unlockTime: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.number().int(),
});
