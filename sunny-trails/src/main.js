import { validateApiConfig } from "./config/apiConfig.js";
import { registerEventHandlers } from "./js/events.js";
import { initializeUi } from "./js/ui.js";

validateApiConfig();

initializeUi();
registerEventHandlers();
