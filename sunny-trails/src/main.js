import { validateApiConfig } from "./config/api-config.js";
import { registerEventHandlers } from "./js/events.js";
import { initializeUi } from "./js/ui.js";

validateApiConfig();

initializeUi();
registerEventHandlers();
