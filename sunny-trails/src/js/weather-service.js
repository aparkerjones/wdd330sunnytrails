import { apiConfig } from "../config/api-config.js";

const WEATHER_TIMEOUT_MS = 60000;

function buildWeatherUrl(params = {}) {
  const url = new URL(`${apiConfig.meteoBaseUrl}/forecast`);

  Object.entries({
    latitude: apiConfig.defaultLat,
    longitude: apiConfig.defaultLon,
    current_weather: true,
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "inch",
    timezone: "auto",
    ...params,
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function requestJson(params) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEATHER_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(buildWeatherUrl(params), {
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Open-Meteo request timed out after ${WEATHER_TIMEOUT_MS}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status})`);
  }

  return response.json();
}

function toFiniteNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeWeather(data = {}) {
  const current = data.current_weather || {};
  const daily = data.daily || {};

  return {
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    timezone: data.timezone || "",
    current: {
      temperature: current.temperature ?? null,
      windSpeed: current.windspeed ?? null,
      windDirection: current.winddirection ?? null,
      time: current.time || "",
      weatherCode: current.weathercode ?? null,
    },
    daily: Array.isArray(daily.time)
      ? daily.time.map((time, index) => ({
          date: time,
          weatherCode: daily.weather_code?.[index] ?? daily.weathercode?.[index] ?? null,
          maxTemperature: daily.temperature_2m_max?.[index] ?? null,
          minTemperature: daily.temperature_2m_min?.[index] ?? null,
          precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
          windSpeed: daily.wind_speed_10m_max?.[index] ?? null,
        }))
      : [],
  };
}

export function getWeatherServiceConfig() {
  return {
    baseUrl: apiConfig.meteoBaseUrl,
    defaultLat: apiConfig.defaultLat,
    defaultLon: apiConfig.defaultLon,
  };
}

export async function getWeatherForecast({ latitude, longitude } = {}) {
  const safeLatitude = toFiniteNumber(latitude) ?? apiConfig.defaultLat;
  const safeLongitude = toFiniteNumber(longitude) ?? apiConfig.defaultLon;

  try {
    const data = await requestJson({
      latitude: safeLatitude,
      longitude: safeLongitude,
    });

    return normalizeWeather(data);
  } catch (error) {
    const shouldRetryWithDefaults =
      error.message.includes("(400)") || error.message.toLowerCase().includes("latitude") || error.message.toLowerCase().includes("longitude");

    const usingDefaultCoords =
      safeLatitude === apiConfig.defaultLat && safeLongitude === apiConfig.defaultLon;

    if (usingDefaultCoords || !shouldRetryWithDefaults) {
      throw error;
    }

    const fallbackData = await requestJson({
      latitude: apiConfig.defaultLat,
      longitude: apiConfig.defaultLon,
    });

    return normalizeWeather(fallbackData);
  }
}

export { normalizeWeather };
