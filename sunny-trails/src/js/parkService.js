import { apiConfig } from "../config/apiConfig.js";

export function getParkServiceConfig() {
  return {
    baseUrl: apiConfig.npsBaseUrl,
    hasApiKey: Boolean(apiConfig.npsKey),
  };
}
