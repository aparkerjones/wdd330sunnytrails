import { validateApiConfig } from "./config/apiConfig.js";
import { registerEventHandlers } from "./js/events.js";
import { initializeUi } from "./js/ui.js";

const configStatus = validateApiConfig();
console.log("Sunny Trails config:", configStatus);

initializeUi();
registerEventHandlers();
