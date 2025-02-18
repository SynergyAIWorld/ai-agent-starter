import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

import { env as apiEnv } from "@acme/api/env";

export const env = createEnv({
  extends: [apiEnv, vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {},

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_IS_PRE: z.string().optional(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    // eslint-disable-next-line no-restricted-properties,turbo/no-undeclared-env-vars
    NEXT_PUBLIC_IS_PRE: process.env.NEXT_PUBLIC_IS_PRE,
    // eslint-disable-next-line no-restricted-properties
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    // eslint-disable-next-line no-restricted-properties
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
