import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const ConfigurationZodSchema = z.object({
  id: z.number().int(),
  key: z.string(),
  value: jsonSchema,
  belong: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.number().int(),
});
