export const apiConfig = {
  npsKey: import.meta.env.VITE_NPS_API_KEY || "",
  npsBaseUrl:
    import.meta.env.VITE_NPS_BASE_URL ||
    "https://developer.nps.gov/api/v1",
  meteoBaseUrl:
    import.meta.env.VITE_OPEN_METEO_BASE_URL ||
    "https://api.open-meteo.com/v1",
  defaultLat: Number(import.meta.env.VITE_DEFAULT_LAT || 39.8283),
  defaultLon: Number(import.meta.env.VITE_DEFAULT_LON || -98.5795),
};

export function validateApiConfig() {
  return {
    hasNpsKey: Boolean(apiConfig.npsKey),
    npsBaseUrl: apiConfig.npsBaseUrl,
    meteoBaseUrl: apiConfig.meteoBaseUrl,
  };
}
