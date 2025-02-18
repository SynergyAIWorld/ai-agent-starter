import { z } from "zod";

import type { EventsZodSchema } from "@acme/db/schema";
import { ConfigurationZodSchema } from "@acme/db/schema";

export const PageConditionSchema = z.object({
  start: z.number().optional().default(0),
  size: z.number().optional().default(10),
  status: z.number().optional().default(0),
  query: z.record(z.unknown()).optional().default({}),
});

export * as SchemaTypes from "@acme/db/schema";

export const Configuration = ConfigurationZodSchema.partial({
  id: true,
  belong: true,
  status: true,
}).omit({
  createdAt: true,
  updatedAt: true,
});
export type AppEventsProps = Omit<z.infer<typeof EventsZodSchema>, "isDeleted">;
