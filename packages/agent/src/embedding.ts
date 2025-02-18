import type { IAgentRuntime } from "./types";
import LocalEmbeddingModelManager from "./localembeddingManager";
import elizaLogger from "./logger";

export type EmbeddingConfig = {
  readonly dimensions: number;
  readonly model: string;
};

export const getEmbeddingConfig = (): EmbeddingConfig => ({
  dimensions: 384,
  model: "BGE-small-en-v1.5",
});

export function getEmbeddingZeroVector(): number[] {
  const embeddingDimension = getEmbeddingConfig().dimensions; // Default BGE dimension
  return Array(embeddingDimension).fill(0);
}

/**
 * Gets embeddings from a remote API endpoint.  Falls back to local BGE/384
 *
 * @param {string} input - The text to generate embeddings for
 * @param {EmbeddingOptions} options - Configuration options including:
 *   - model: The model name to use
 *   - endpoint: Base API endpoint URL
 *   - apiKey: Optional API key for authentication
 *   - isOllama: Whether this is an Ollama endpoint
 *   - dimensions: Desired embedding dimensions
 * @param {IAgentRuntime} runtime - The agent runtime context
 * @returns {Promise<number[]>} Array of embedding values
 * @throws {Error} If the API request fails
 */

export async function embed(runtime: IAgentRuntime, input: string) {
  // Validate input
  if (!input || typeof input !== "string" || input.trim().length === 0) {
    elizaLogger.warn("Invalid embedding input:", {
      input,
      type: typeof input,
      length: input?.length,
    });
    return []; // Return empty embedding array
  }
  // Check cache first
  const cachedEmbedding = await _retrieveCachedEmbedding(runtime, input);
  if (cachedEmbedding) return cachedEmbedding;

  try {
    return await _getLocalEmbedding(input);
  } catch (error) {
    elizaLogger.warn("Local embedding failed, falling back to remote", error);
  }

  //
  async function _getLocalEmbedding(input: string): Promise<number[]> {
    elizaLogger.debug("DEBUG - Inside getLocalEmbedding function");
    try {
      const embeddingManager = LocalEmbeddingModelManager.getInstance();
      return await embeddingManager.generateEmbedding(input);
    } catch (error) {
      elizaLogger.error("Local embedding failed:", error);
      throw error;
    }
  }

  async function _retrieveCachedEmbedding(
    runtime: IAgentRuntime,
    input: string,
  ) {
    //levenshtein argument exceeds maximum length of 255 characters
    if (!input || input.length > 255) {
      elizaLogger.log("No input to retrieve cached embedding for");
      return null;
    }

    const similaritySearchResult =
      await runtime.messageManager.getCachedEmbeddings(input);
    if (similaritySearchResult.length > 0) {
      return similaritySearchResult[0].embedding;
    }
    return null;
  }
}
