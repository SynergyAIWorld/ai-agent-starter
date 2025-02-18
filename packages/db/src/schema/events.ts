import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const EventsZodSchema = z.object({
  id: z.string(),
  rowKey: z.string(),
  level: z.string(),
  name: z.string(),
  content: jsonSchema,
  target: z.string(),
  userId: z.string().nullish(),
  agentId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.number().int(),
});
