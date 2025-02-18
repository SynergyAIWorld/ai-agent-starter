import database from "~/games/database";
import { SrvStart } from "~/server/start";

(() => {
  database.initializeDatabase();
  SrvStart.getInstance().start(8000);
})();
