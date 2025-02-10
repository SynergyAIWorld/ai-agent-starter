import { z } from "zod";

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).optional(),
    RABBIT_MQ_URL: z.string().default("amqp://user:pass@127.0.0.1:5672/vhost"),
  })
  .parse(process.env);
