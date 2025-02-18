import * as z from "zod";

export const VerificationTokenZodSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
});
