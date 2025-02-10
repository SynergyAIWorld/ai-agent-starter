import Koa from "koa";
import Router from "koa-router";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "node:path";
import serve from "koa-static";
import cors from "koa2-cors";
import { w3Logger } from "@acme/lib/tools";
import { env } from "~/env";
import bodyParser from "@koa/bodyparser";
import jwt from "koa-jwt";
import { startAgent } from "src/server/core";
import type { IAgentRuntime } from "@elizaos/core";
import { myCharacter } from "~/characters/myCharacter";
import { router as aiAgentRouter } from "~/agent/router";
import multer from "@koa/multer";

export class SrvStart {
  private static instance: SrvStart | null;
  private app: Koa;
  private router: Router;
  private readonly uploadDir: string;
  private runtimes: Record<string, IAgentRuntime> = {};

  constructor() {
    this.app = new Koa();
    this.router = new Router({ prefix: "/api" });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dir = path.join(__dirname, "../public");
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    this.uploadDir = uploadDir;
    this.app.use(serve(dir));
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
    // Apply router middleware before JWT
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    this.app.use(aiAgentRouter.routes()).use(aiAgentRouter.allowedMethods());

    // Then add JWT and protected routes
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

    void startAgent(myCharacter)
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

  private initializeProtectedRoutes() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });
    const upload = multer({ storage });

    // Add protected routes here
    this.router.post("/upload", upload.single("file"), (ctx) => {
      ctx.body = { status: 200, message: "Upload successful!" };
    });
  }

  public start(port: number) {
    this.initializeProtectedRoutes();
    this.app.listen(port, () => {
      w3Logger.success(`Server running at http://localhost:${port}`);
    });
  }
}
