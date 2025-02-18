import needle from "needle";

import { db } from "@acme/db/client";
import { w3Logger } from "@acme/lib/tools";

import { env } from "../env";

/**
 * config
 */
const starterApi = {
  headers: {
    Authorization: `Bearer ${env.AGENT_API_TOKEN}`,
    "Content-type": "application/json",
  },
  serverUrl: env.AGENT_API_ENDPOINT,
};

const userAccount = async (userId?: string | null) => {
  w3Logger.log("Using user account", userId);
  if (!userId) {
    throw new Error(`Mission userId: ${userId}`);
  }
  /**
   * Get Provider account
   */
  const account = await db.account.findFirst({
    where: { provider: "wallet", userId },
  });
  if (!account) {
    throw new Error("Wallet not connected");
  }
  return account.providerAccountId;
};

export const aiAgent = async (
  userId: string,
  message: {
    content: string;
    image?: {
      type: "image/png" | "image/jpg" | "image/jpeg";
      data: string;
    };
  },
) => {
  const address = await userAccount(userId);
  const resp = await needle(
    "post",
    `${starterApi.serverUrl}/agent/default/message`,
    JSON.stringify({
      user: {
        id: userId,
        name: address,
      },
      ...message,
    }),
    {
      headers: starterApi.headers,
    },
  );
  const result = resp.body as {
    user: string;
    text: string;
    action?: string;
    result?: Record<string, unknown>;
  }[];
  w3Logger.log(
    `AiAgent User ${address}`,
    "<<<A.",
    userId,
    JSON.stringify(result),
  );

  return result;
};
