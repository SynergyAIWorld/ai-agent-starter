import { adminRouter } from "./router/admin";
import { authRouter } from "./router/auth";
import { generalRouter } from "./router/general";
import { settingRouter } from "./router/setting";
import { traceRouter } from "./router/trace";
import { userRouter } from "./router/user";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  setting: settingRouter,
  general: generalRouter,
  trace: traceRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
