import { cache } from "react";

import { getServerAuthSession, handlers } from "./auth";

export type { Session } from "next-auth";

/**
 * This is the main way to get session data for your RSCs.
 * This will de-duplicate all calls to next-auth's default `auth()` function and only call it once per request
 */
const auth = cache(getServerAuthSession);

export { handlers, auth };

export { invalidateSessionToken, validateToken, isSecureContext } from "./auth";
