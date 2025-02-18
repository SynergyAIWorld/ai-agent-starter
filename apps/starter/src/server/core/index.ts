import {
  AgentRuntime,
  bootstrapPlugin,
  CacheManager,
  DbCacheAdapter,
  elizaLogger,
  ModelProviderName,
  postgresAdapter,
  settings,
  stringToUuid,
} from "@acmeos/core";

import type {
  Character,
  ICacheManager,
  IDatabaseAdapter,
  IDatabaseCacheAdapter,
} from "@acmeos/core";
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
    managers: [],
    cacheManager: cache,
  });
}

export async function startAgent(character: Character) {
  try {
    character.id ??= stringToUuid(character.name);
    character.username ??= character.name;
    const token = getTokenForProvider(character.modelProvider, character) ?? "";
    const db = postgresAdapter as IDatabaseAdapter;
    await db.init();
    const cacheAdapter = postgresAdapter as IDatabaseCacheAdapter;
    const cache = new CacheManager(
      new DbCacheAdapter(
        cacheAdapter,
        character.id ?? stringToUuid(character.name),
      ),
    );
    const runtime = createAgent(character, db, cache, token);
    await runtime.initialize();
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
