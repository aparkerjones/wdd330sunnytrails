import { apiConfig } from "../config/apiConfig.js";

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
  const response = await fetch(buildWeatherUrl(params));

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status})`);
  }

  return response.json();
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
  const data = await requestJson({
    latitude: latitude ?? apiConfig.defaultLat,
    longitude: longitude ?? apiConfig.defaultLon,
  });

  return normalizeWeather(data);
}

export { normalizeWeather };
