import * as console from "node:console";
import path from "node:path";
import { fileURLToPath } from "url";
import bodyParser from "@koa/bodyparser";
import Koa from "koa";
import jwt from "koa-jwt";
import serve from "koa-static";
import ws from "koa-websocket";
import cors from "koa2-cors";
import { startAgent } from "src/server/core";

import type { IAgentRuntime } from "@acmeos/core";
import { w3Logger } from "@acme/lib/tools";

import { router as aiAgentRouter } from "~/agent/router";
import { defaultCharacter } from "~/characters/defaultCharacter";
import { env } from "~/env";
import { verifyToken } from "~/games/auth";
import { GameHandler } from "~/games/GameHandlers";
import { NetPack } from "~/games/NetPack";
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from "~/server/core/base64Message";

export class SrvStart {
  private static instance: SrvStart | null;
  private app = ws(new Koa());
  private runtimes: Record<string, IAgentRuntime> = {};
  private gameHandler: GameHandler;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dir = path.join(__dirname, "../public");
    this.app.use(serve(dir));
    //cors
    this.app.use(
      cors({
        origin: function () {
          return "*";
        },
        maxAge: 5,
        credentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "Accept"],
        exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      }),
    );
    this.app.use(bodyParser());
    // http
    this.app
      .use(async (ctx, next) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return await next();
        } catch (error) {
          ctx.body = { status: 400, error };
        }
      })
      .use(async (ctx, next) => {
        if (/^\/api\//.exec(ctx.url)) {
          w3Logger.log("Endpoint:", ctx.url);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return await next();
        } else {
          ctx.throw("Invalid URL");
        }
      })
      .use(jwt({ secret: env.JWT_TOKEN_SECRET }));
    // ws
    this.initWebSocket();
    //game
    this.gameHandler = new GameHandler(
      path.join(
        process.cwd(),
        process.env.NODE_ENV === "production"
          ? "/apps/starter/dist/proto"
          : "/public/proto",
      ),
    );
    //router
    this.app.use(aiAgentRouter.routes()).use(aiAgentRouter.allowedMethods());
    //start default agent
    this.startAiAgent();
  }

  private initWebSocket() {
    this.app.ws.use(async (ctx, next) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        ctx.websocket.on("open", () => {
          console.log("###Opening Proto");
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        ctx.websocket.on("close", (code: number, reason: Buffer) => {
          console.log(
            "###WebSocket connection closed",
            code,
            reason.toString(),
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        ctx.websocket.on("error", (err: Error) => {
          console.error("###WebSocket connection error", err);
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        ctx.websocket.on("message", async (message: Buffer) => {
          try {
            const token = ctx.url.slice(1);
            if (!verifyToken(token)) {
              console.error("Verification failed", token);
              return;
            }
            //Process Request
            const bufferMessage = base64ToUint8Array(message.toString());
            const { cmd, buffer } = await NetPack.unpack(bufferMessage.buffer);
            const result = await this.gameHandler.handle(cmd, buffer);
            const pack = NetPack.pack(result.cmd, result.buffer);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            ctx.websocket.send(uint8ArrayToBase64(pack));
          } catch (error) {
            console.error("Error processing message:", error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            ctx.websocket.send(Date.now());
          }
        });

        await next();
      } catch (error) {
        w3Logger.error("Error run websocket", error);
      }
    });
  }

  private startAiAgent() {
    void startAgent(defaultCharacter)
      .then((runtime) => {
        this.runtimes.default = runtime;
      })
      .catch((e) => {
        w3Logger.error("Default Agent Init Error", e);
      });
  }

  public static getInstance(): SrvStart {
    if (!SrvStart.instance) {
      SrvStart.instance = new SrvStart();
    }
    return SrvStart.instance;
  }

  public defaultRuntime() {
    return this.runtimes.default;
  }

  public start(port: number) {
    this.app.listen(port, () => {
      w3Logger.success(
        `Server running at http://localhost:${port} - Env: ${env.NODE_ENV}`,
      );
    });
  }
}
