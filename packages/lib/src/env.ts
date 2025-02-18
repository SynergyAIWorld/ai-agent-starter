import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).optional(),
  })
  .parse(process.env);
