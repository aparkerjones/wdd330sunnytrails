import { apiConfig } from "../config/apiConfig.js";

export function getWeatherServiceConfig() {
  return {
    baseUrl: apiConfig.meteoBaseUrl,
    defaultLat: apiConfig.defaultLat,
    defaultLon: apiConfig.defaultLon,
  };
}
