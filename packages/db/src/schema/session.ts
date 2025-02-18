import * as z from "zod";

export const SessionZodSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
