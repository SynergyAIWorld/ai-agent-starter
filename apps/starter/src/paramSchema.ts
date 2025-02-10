import { z } from "zod";

export const agentSchema = z.object({ agentId: z.string().min(1) });
export const promptSchema = z.object({
  content: z.string().min(1),
  imageData: z.string().optional(),
  type: z.enum(["image/png"]).optional(),
});
