import Router from "koa-router";

import { agentSchema, promptSchema } from "~/paramSchema";
import { aiAgent } from "~/server/core/generation";
import { SrvStart } from "~/server/start";
import { elizaLogger } from "@elizaos/core";

export const router = new Router({ prefix: "/api" });
/**
 * Text
 */
router.post("/agent/:agentId/message", async (ctx) => {
  try {
    const { agentId } = agentSchema.parse(ctx.params);
    const param = promptSchema.parse(ctx.request.body);
    try {
      const response = await aiAgent({
        user: {
          id: agentId,
          name: agentId,
        },
        text: param.content,
        runtime: SrvStart.getInstance().defaultRuntime(),
      });
      elizaLogger.info("AI agent response:", response);
      ctx.body = response;
    } catch (aiError) {
      elizaLogger.error("AI agent error:", aiError);
      ctx.status = 500;
      ctx.body = {
        error: "AI processing failed",
        details: aiError,
        stack: aiError instanceof Error ? aiError.stack : undefined,
      };
    }
  } catch (error) {
    elizaLogger.error("Chat test error:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal server error", details: error };
  }
});
