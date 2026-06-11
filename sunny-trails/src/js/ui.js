import { renderItineraryForm } from "./itinerary-form.js";
import { renderItineraryList } from "./itinerary-list.js";
import { renderParkCard } from "./park-card.js";
import { renderParkDetail } from "./park-detail.js";
import { getAllTrips } from "./storage.js";

export function renderParkResults(parks = []) {
  if (!parks.length) {
    return `<p>No parks to show. Try adjusting your filters by name, state, or activity.</p>`;
  }

  return `<div class="park-results">${parks.map(renderParkCard).join("")}</div>`;
}

function formatForecastDate(value) {
  if (!value) return "Unknown";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getWeatherVisual(code) {
  const weatherCode = Number(code);

  if (weatherCode === 0) {
    return { icon: "&#9728;", label: "Clear" };
  }

  if ([1, 2].includes(weatherCode)) {
    return { icon: "&#127780;", label: "Partly cloudy" };
  }

  if (weatherCode === 3) {
    return { icon: "&#9729;", label: "Cloudy" };
  }

  if ([45, 48].includes(weatherCode)) {
    return { icon: "&#127787;", label: "Fog" };
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { icon: "&#127783;", label: "Drizzle" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { icon: "&#127783;", label: "Rain" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { icon: "&#10052;", label: "Snow" };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return { icon: "&#9928;", label: "Thunderstorm" };
  }

  return { icon: "&#127781;", label: "Mixed" };
}

export function renderWeatherPanel(
  weather = null,
  { loading = false, errorMessage = "", sectionId = "" } = {}
) {
  const idAttribute = sectionId ? ` id="${sectionId}"` : "";

  if (loading) {
    return `
      <section class="detail-group"${idAttribute}>
        <h3>Weather</h3>
        <p>Loading weather...</p>
      </section>
    `;
  }

  if (errorMessage) {
    return `
      <section class="detail-group"${idAttribute}>
        <h3>Weather</h3>
        <p>Weather is temporarily unavailable. ${errorMessage}</p>
      </section>
    `;
  }

  const forecastItems = Array.isArray(weather?.daily)
    ? weather.daily.slice(0, 7)
    : [];

  const forecastHtml = forecastItems.length
    ? `
      <div class="forecast-grid">
        ${forecastItems
          .map(
            (day) => {
              const visual = getWeatherVisual(day.weatherCode);

              return `
          <article class="forecast-item">
            <p class="forecast-date">${formatForecastDate(day.date)}</p>
            <p class="forecast-condition"><span class="forecast-icon" title="${visual.label}" aria-label="${visual.label}">${visual.icon}</span> ${visual.label}</p>
            <p><strong>High:</strong> ${day.maxTemperature ?? "N/A"}°F</p>
            <p><strong>Low:</strong> ${day.minTemperature ?? "N/A"}°F</p>
            <p><strong>Precip chance:</strong> ${day.precipitationProbability ?? "N/A"}%</p>
          </article>
        `;
            }
          )
          .join("")}
      </div>
    `
    : "<p>The 7-day forecast is not available right now.</p>";

  return weather
    ? `
      <section class="detail-group"${idAttribute}>
        <h3>Weather</h3>
        <p><strong>Current temperature:</strong> ${weather.current.temperature ?? "Not available"}°F</p>
        <p><strong>Wind speed:</strong> ${weather.current.windSpeed ?? "Not available"} mph</p>
        <h4>Next 7 Days</h4>
        ${forecastHtml}
      </section>
    `
    : `
      <section class="detail-group"${idAttribute}>
        <h3>Weather</h3>
        <p>Weather info is not available right now.</p>
      </section>
    `;
}

export function renderAlertsPanel(
  alerts = [],
  { loading = false, errorMessage = "", sectionId = "" } = {}
) {
  const idAttribute = sectionId ? ` id="${sectionId}"` : "";

  if (loading) {
    return `
      <section class="detail-group"${idAttribute}>
        <h3>Alerts</h3>
        <p>Loading alerts...</p>
      </section>
    `;
  }

  if (errorMessage) {
    return `
      <section class="detail-group"${idAttribute}>
        <h3>Alerts</h3>
        <p>Alerts are temporarily unavailable. ${errorMessage}</p>
      </section>
    `;
  }

  const alertsHtml = alerts.length
    ? `<ul class="alert-list">${alerts.map((alert) => `<li><strong>${alert.title}</strong>${alert.description ? ` - ${alert.description}` : ""}</li>`).join("")}</ul>`
    : `<p>No active alerts were reported for this park.</p>`;

  return `
    <section class="detail-group"${idAttribute}>
      <h3>Alerts</h3>
      ${alertsHtml}
    </section>
  `;
}

export function renderParkDetails(park = null, weather = null, alerts = []) {
  if (!park) {
    return `<p>Choose a park to see details, weather, and alerts.</p>`;
  }

  return `
    ${renderParkDetail(park)}
    ${renderWeatherPanel(weather)}
    ${renderAlertsPanel(alerts)}
  `;
}

export function initializeUi() {
  const searchNode = document.getElementById("search");
  const detailsNode = document.getElementById("details");
  const itineraryNode = document.getElementById("itinerary");

  if (!searchNode || !detailsNode || !itineraryNode) {
    return;
  }

  searchNode.innerHTML = `
    <h2 class="section-title">Find Your Next Park Adventure</h2>
    <p class="section-description">All parks load automatically. Use filters by park name, state, or activity.</p>
    <form id="park-search-form" class="search-form">
      <label>
        <span>Park name filter</span>
        <input name="query" type="search" placeholder="Yellowstone" />
      </label>
      <label>
        <span>State filter (code or name)</span>
        <input name="stateCode" type="text" placeholder="WY, Utah, New York" />
      </label>
      <label>
        <span>Activity filter</span>
        <input name="activity" type="search" placeholder="Hiking" />
      </label>
      <div class="search-actions">
        <button type="submit">Apply filters</button>
        <button type="button" id="clear-filters-button" class="secondary-button">Clear filters</button>
      </div>
    </form>
    <p id="search-status" class="status-message">Loading all parks...</p>
    <div id="park-results"></div>
  `;

  detailsNode.innerHTML = `
    <h2 class="section-title">Park Details</h2>
    <p id="details-helper" class="section-description">Weather and current alerts will appear after you choose a park.</p>
    <div id="park-details-panel">
      <p>Choose a park to see details, weather, and alerts.</p>
    </div>
  `;

  const trips = getAllTrips();

  itineraryNode.innerHTML = `
    <h2 class="section-title">Build Your Itinerary</h2>
    <p class="section-description">Save park ideas with dates and notes so your route is ready when you are.</p>
    ${renderItineraryForm()}
    <div id="itinerary-list">
      ${renderItineraryList(trips)}
    </div>
  `;
}
