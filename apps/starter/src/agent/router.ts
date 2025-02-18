import { elizaLogger } from "@acmeos/core";
import Router from "koa-router";

import auth from "~/games/auth";
import { agentSchema, loginSchema, promptSchema } from "~/paramSchema";
import { aiAgent } from "~/server/core/generation";
import { SrvStart } from "~/server/start";

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
/**
 * Text
 */
router.post("/login", (ctx) => {
  try {
    const { address, signature, message } = loginSchema.parse(ctx.request.body);
    if (auth.verifySignature(address, signature, message)) {
      const token = auth.generateToken(signature);
      ctx.body = { token };
    } else {
      ctx.status = 401;
      ctx.body = { error: "Invalid signature" };
    }
  } catch (error) {
    elizaLogger.error("Chat test error:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal server error", details: error };
  }
});
