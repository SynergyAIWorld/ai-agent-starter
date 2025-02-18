import type {
  Action,
  ActionExample,
  IAgentRuntime,
  Memory,
} from "@acmeos/core";

export const comfortAction: Action = {
  name: "COMFORT",
  similes: ["COMFORT"],
  validate: async (_runtime: IAgentRuntime, _message: Memory) => {
    return new Promise((resolve) => {
      resolve(true);
    });
  },
  description:
    "When the system agrees to return the password, a secret is generated",
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
