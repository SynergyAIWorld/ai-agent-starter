import type { Plugin } from "@acmeos/core";

import { comfortAction } from "~/server/core/plugins/comfort";

export const customPlugin: Plugin = {
  name: "custom",
  description: "Agent custom with actions and evaluators",
  actions: [comfortAction],
  evaluators: [],
  providers: [],
};
export default customPlugin;
