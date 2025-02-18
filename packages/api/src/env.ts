import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {},
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    AGENT_API_TOKEN: z.string().min(10).default("0000000000"),
    AGENT_API_ENDPOINT: z
      .string()
      .url()
      .default("http://localhost:8000/api/v0"),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
