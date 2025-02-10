import { TwitterClientInterface } from "@elizaos/client-twitter";
import type { Character, IAgentRuntime } from "@elizaos/core";

export async function initializeClients(
  character: Character,
  runtime: IAgentRuntime,
) {
  const clients = [];
  const clientTypes = character.clients.map((str) => str.toLowerCase());

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (clientTypes.includes("twitter") && process.env.TWITTER_USERNAME) {
    const twitterClients = await TwitterClientInterface.start(runtime);
    clients.push(twitterClients);
  }

  if (character.plugins.length > 0) {
    for (const plugin of character.plugins) {
      if (plugin.clients) {
        for (const client of plugin.clients) {
          clients.push(await client.start(runtime));
        }
      }
    }
  }
  return clients;
}
