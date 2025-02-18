import type { Plugin } from "../";
import {
  continueAction,
  followRoomAction,
  ignoreAction,
  muteRoomAction,
  noneAction,
  unfollowRoomAction,
  unmuteRoomAction,
} from "./actions";
import { factEvaluator, goalEvaluator } from "./evaluators";
import { boredomProvider, factsProvider, timeProvider } from "./providers";

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const bootstrapPlugin: Plugin = {
  name: "bootstrap",
  description: "Agent bootstrap with basic actions and evaluators",
  actions: [
    continueAction,
    followRoomAction,
    unfollowRoomAction,
    ignoreAction,
    noneAction,
    muteRoomAction,
    unmuteRoomAction,
  ],
  evaluators: [factEvaluator, goalEvaluator],
  providers: [boredomProvider, timeProvider, factsProvider],
};
export default bootstrapPlugin;
