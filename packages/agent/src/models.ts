import type {
  EmbeddingModelSettings,
  ImageModelSettings,
  Models,
  ModelSettings,
} from "./types.ts";
import settings from "./settings.ts";
import { ModelClass, ModelProviderName } from "./types.ts";

export const models: Models = {
  [ModelProviderName.OPENAI]: {
    endpoint: settings.OPENAI_API_URL || "https://api.openai.com/v1",
    model: {
      [ModelClass.SMALL]: {
        name: settings.SMALL_OPENAI_MODEL || "gpt-4o-mini",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.6,
      },
      [ModelClass.MEDIUM]: {
        name: settings.MEDIUM_OPENAI_MODEL || "gpt-4o",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.6,
      },
      [ModelClass.LARGE]: {
        name: settings.LARGE_OPENAI_MODEL || "gpt-4o",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.6,
      },
      [ModelClass.EMBEDDING]: {
        name: settings.EMBEDDING_OPENAI_MODEL || "text-embedding-3-small",
        dimensions: 1536,
      },
      [ModelClass.IMAGE]: {
        name: settings.IMAGE_OPENAI_MODEL || "dall-e-3",
      },
    },
  },
  [ModelProviderName.DEEPSEEK]: {
    endpoint: settings.DEEPSEEK_API_URL || "https://api.deepseek.com",
    model: {
      [ModelClass.SMALL]: {
        name: settings.SMALL_DEEPSEEK_MODEL || "deepseek-chat",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.7,
      },
      [ModelClass.MEDIUM]: {
        name: settings.MEDIUM_DEEPSEEK_MODEL || "deepseek-chat",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.7,
      },
      [ModelClass.LARGE]: {
        name: settings.LARGE_DEEPSEEK_MODEL || "deepseek-chat",
        stop: [],
        maxInputTokens: 128000,
        maxOutputTokens: 8192,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        temperature: 0.7,
      },
    },
  },
};

export function getModelSettings(
  provider: ModelProviderName,
  type: ModelClass,
): ModelSettings | undefined {
  return models[provider]?.model[type] as ModelSettings | undefined;
}

export function getImageModelSettings(
  provider: ModelProviderName,
): ImageModelSettings | undefined {
  return models[provider]?.model[ModelClass.IMAGE] as
    | ImageModelSettings
    | undefined;
}

export function getEndpoint(provider: ModelProviderName) {
  return models[provider].endpoint;
}
