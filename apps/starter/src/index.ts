import { SrvStart } from "~/server/start";

(() => {
  SrvStart.getInstance().start(8000);
})();
