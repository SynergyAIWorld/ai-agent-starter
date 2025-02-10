import * as process from "node:process";
import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).optional(),
    JWT_TOKEN_SECRET: z.string().min(10).default("0000000000"),
    DATABASE_URL: z.string().min(10).default("0000000000"),
  })
  .parse(process.env);
