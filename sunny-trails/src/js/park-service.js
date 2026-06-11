import { apiConfig } from "../config/api-config.js";

function buildUrl(path, params = {}) {
  const url = new URL(`${apiConfig.npsBaseUrl}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  if (apiConfig.npsKey) {
    url.searchParams.set("api_key", apiConfig.npsKey);
  }

  return url;
}

async function requestJson(path, params) {
  const response = await fetch(buildUrl(path, params));

  if (!response.ok) {
    throw new Error(`National Park Service request failed (${response.status})`);
  }

  return response.json();
}

function parseLatLong(value = "") {
  const text = String(value || "");
  if (!text.trim()) {
    return { latitude: "", longitude: "" };
  }

  const latMatch = text.match(/lat\s*:?\s*(-?\d+(?:\.\d+)?)/i);
  const lonMatch = text.match(/(?:long|lng|lon)\s*:?\s*(-?\d+(?:\.\d+)?)/i);

  return {
    latitude: latMatch?.[1] || "",
    longitude: lonMatch?.[1] || "",
  };
}

function normalizePark(record = {}) {
  const images = Array.isArray(record.images)
    ? record.images.map((image) => ({
        altText: image.altText || record.fullName || record.name || "Park image",
        caption: image.caption || "",
        url: image.url || "",
      }))
    : [];

  const activities = Array.isArray(record.activities)
    ? record.activities
        .map((activity) => activity?.name || "")
        .filter(Boolean)
    : [];

  const latLongFallback = parseLatLong(record.latLong);
  const latitude = record.latitude || latLongFallback.latitude || "";
  const longitude = record.longitude || latLongFallback.longitude || "";

  return {
    parkCode: record.parkCode || "",
    name: record.fullName || record.name || "Unknown park",
    shortName: record.name || record.fullName || "Unknown park",
    description: record.description || "",
    states: record.states || "",
    designation: record.designation || "",
    directionsInfo: record.directionsInfo || "",
    directionsUrl: record.directionsUrl || "",
    weatherInfo: record.weatherInfo || "",
    url: record.url || "",
    latitude,
    longitude,
    activities,
    images,
  };
}

function normalizeAlert(record = {}) {
  return {
    id: record.id || "",
    title: record.title || "Park alert",
    category: record.category || "",
    description: record.description || "",
    url: record.url || "",
  };
}

export function getParkServiceConfig() {
  return {
    baseUrl: apiConfig.npsBaseUrl,
    hasApiKey: Boolean(apiConfig.npsKey),
  };
}

export async function searchParks({ query = "", stateCode = "", sort = "", limit = 10 } = {}) {
  const data = await requestJson("/parks", {
    q: query,
    stateCode,
    sort,
    limit,
  });

  return (data.data || []).map(normalizePark);
}

export async function getParkByCode(parkCode) {
  if (!parkCode) {
    throw new Error("A park code is required to load park details.");
  }

  const data = await requestJson("/parks", {
    parkCode,
    limit: 1,
  });

  return normalizePark((data.data || [])[0]);
}

export async function getParkAlerts(parkCode) {
  if (!parkCode) {
    throw new Error("A park code is required to load alerts.");
  }

  const data = await requestJson("/alerts", {
    parkCode,
    limit: 50,
  });

  return (data.data || []).map(normalizeAlert);
}

export { normalizeAlert, normalizePark };
