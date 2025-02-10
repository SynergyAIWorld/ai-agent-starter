import type {
  ActionExample,
  IAgentRuntime,
  Memory,
  Action,
} from "@elizaos/core";

export const comfortAction: Action = {
  name: "COMFORT",
  similes: ["COMFORT"],
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
  description: "Call this action if user feels emotionally sad.",
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "I am cried" },
      },
      {
        user: "{{user2}}",
        content: { text: "", action: "COMFORT" },
      },
    ],
  ] as ActionExample[][],
} as Action;
