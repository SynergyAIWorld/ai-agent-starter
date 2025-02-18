import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const UserProfileZodSchema = z.object({
  userId: z.string(),
  nickName: z.string(),
  avatar: z.string().nullish(),
  points: z.number().int(),
  role: z.number().int(),
  referralCode: z.string().nullish(),
  memories: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.number().int(),
});
