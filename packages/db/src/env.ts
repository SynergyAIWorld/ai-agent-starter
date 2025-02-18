import { z } from "zod";

// export const env = createEnv({
//   server: {
//     NODE_ENV: z.enum(["development", "production"]).optional(),
//     DATABASE_URL: z.string(),
//   },
//   client: {},
//   experimental__runtimeEnv: {},
//   skipValidation:
//     !!process.env.CI || process.env.npm_lifecycle_event === "lint",
// });

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).optional(),
    DATABASE_URL: z
      .string()
      .default(
        "postgresql://postgres:password@127.0.0.1:5432/bucket?schema=public",
      ),
  })
  .parse(process.env);
