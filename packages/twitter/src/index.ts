import { type Client, elizaLogger, type IAgentRuntime } from "@elizaos/core";
import { ClientBase } from "./base";
import { validateTwitterConfig, type TwitterConfig } from "./environment";
import { TwitterInteractionClient } from "./interactions";
import { TwitterPostClient } from "./post";
import { TwitterSearchClient } from "./search";

/**
 * A manager that orchestrates all specialized Twitter logic:
 * - client: base operations (login, timeline caching, etc.)
 * - post: autonomous posting logic
 * - search: searching tweets / replying logic
 * - interaction: handling mentions, replies
 */
class TwitterManager {
  client: ClientBase;
  post: TwitterPostClient;
  search: TwitterSearchClient;
  interaction: TwitterInteractionClient;

  constructor(runtime: IAgentRuntime, twitterConfig: TwitterConfig) {
    // Pass twitterConfig to the base client
    this.client = new ClientBase(runtime, twitterConfig);
    // Posting logic
    this.post = new TwitterPostClient(this.client, runtime);
    // Mentions and interactions
    this.interaction = new TwitterInteractionClient(this.client, runtime);
  }
}

export const TwitterClientInterface: Client = {
  async start(runtime: IAgentRuntime) {
    const twitterConfig: TwitterConfig = await validateTwitterConfig(runtime);

    elizaLogger.log("Twitter client started");

    const manager = new TwitterManager(runtime, twitterConfig);
    // Initialize login/session
    await manager.client.init();
    // Start the posting loop
    await manager.post.start();
    // Start the search logic if it exists
    if (manager.search) {
      await manager.search.start();
    }
    // Start interactions (mentions, replies)
    await manager.interaction.start();
    return manager;
  },

  async stop(_runtime: IAgentRuntime) {
    elizaLogger.warn("Twitter client does not support stopping yet");
  },
};

export default TwitterClientInterface;
