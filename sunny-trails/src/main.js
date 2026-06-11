import { validateApiConfig } from "./config/apiConfig.js";
import { registerEventHandlers } from "./js/events.js";
import { initializeUi } from "./js/ui.js";

const { hasNpsKey } = validateApiConfig();

if (!hasNpsKey) {
  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.createElement("p");
    banner.style.cssText = "background:#fee;color:#900;padding:1rem;text-align:center;margin:0;";
    banner.textContent = "NPS API key is missing — park search will not work.";
    document.body.prepend(banner);
  });
}

initializeUi();
registerEventHandlers();
