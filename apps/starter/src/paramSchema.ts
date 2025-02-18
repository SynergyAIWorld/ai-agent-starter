import { z } from "zod";

export const agentSchema = z.object({ agentId: z.string().min(1) });
export const promptSchema = z.object({
  content: z.string().min(1),
  imageData: z.string().optional(),
  type: z.enum(["image/png"]).optional(),
});
export const loginSchema = z.object({
  address: z.string().min(10),
  signature: z.string().min(10),
  message: z.string().min(10),
});
