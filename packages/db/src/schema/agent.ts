import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const AgentZodSchema = z.object({
  id: z.string(),
  name: z.string(),
  config: jsonSchema,
  status: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
