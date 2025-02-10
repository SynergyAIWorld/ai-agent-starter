import type { Character, ICacheManager, IDatabaseAdapter } from "@elizaos/core";
import PostgresDatabaseAdapter from "@elizaos/adapter";
import {
  AgentRuntime,
  CacheManager,
  DbCacheAdapter,
  elizaLogger,
  ModelProviderName,
  settings,
  stringToUuid,
} from "@elizaos/core";
import { bootstrapPlugin } from "@elizaos/bootstrap";

import { env } from "~/env";
import { initializeClients } from "~/server/core/clients";
import { w3Logger } from "@acme/lib/tools";
import customPlugin from "~/server/core/plugins";

export function createAgent(
  character: Character,
  db: IDatabaseAdapter,
  cache: ICacheManager,
  token: string,
) {
  elizaLogger.info(
    elizaLogger.successesTitle,
    "Creating runtime for character",
    character.name,
  );

  return new AgentRuntime({
    databaseAdapter: db,
    token,
    modelProvider: character.modelProvider,
    evaluators: [],
    character,
    plugins: [bootstrapPlugin, customPlugin].filter(Boolean),
    providers: [],
    actions: [],
    services: [],
    managers: [],
    cacheManager: cache,
  });
}

export async function startAgent(character: Character) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;
    const token = getTokenForProvider(character.modelProvider, character) ?? "";
    const db = new PostgresDatabaseAdapter({
      connectionString: env.DATABASE_URL,
    });
    await db.init();
    const cache = new CacheManager(
      new DbCacheAdapter(db, character.id ?? stringToUuid(character.name)),
    );
    const runtime = createAgent(character, db, cache, token);
    await runtime.initialize();
    try {
      runtime.clients = await initializeClients(character, runtime);
    } catch (err) {
      w3Logger.error("InitializeClients Error", err);
    }
    // report to console
    elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);
    return runtime;
  } catch (error) {
    elizaLogger.error(
      `Error starting agent for character.`, // Now character is in scope!
      error,
    );
    console.error(error);
    throw error;
  }
}

export function getTokenForProvider(
  provider: ModelProviderName,
  character: Character,
): string | undefined {
  switch (provider) {
    case ModelProviderName.LLAMALOCAL:
    case ModelProviderName.OLLAMA:
    case ModelProviderName.GAIANET:
      return;
    case ModelProviderName.OPENAI:
      return (
        character.settings?.secrets?.OPENAI_API_KEY ?? settings.OPENAI_API_KEY
      );
    case ModelProviderName.DEEPSEEK:
      return (
        character.settings?.secrets?.DEEPSEEK_API_KEY ??
        settings.DEEPSEEK_API_KEY
      );
    default:
      w3Logger.error("Error getting token");
      return;
  }
}
