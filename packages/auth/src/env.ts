/* eslint-disable no-restricted-properties */
import { z } from "zod";

export const env = z
  .object({
    NEXTAUTH_URL: z.string().url().default("http://localhost:3000/api/auth"),
    AUTH_DISCORD_ID: z.string().min(1).default("0"),
    AUTH_DISCORD_SECRET: z.string().min(1).default("0"),
    AUTH_TWITTER_ID: z.string().min(1).default("0"),
    AUTH_TWITTER_SECRET: z.string().min(1).default("0"),
    AUTH_SECRET: z.string().min(1).default("0"),
    NODE_ENV: z.enum(["development", "production"]).optional(),
  })
  .parse(process.env);
