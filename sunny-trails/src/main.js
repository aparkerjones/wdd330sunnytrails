import { validateApiConfig } from "./config/apiConfig.js";

const configStatus = validateApiConfig();
console.log("Sunny Trails config:", configStatus);
