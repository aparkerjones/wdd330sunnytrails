import { renderItineraryForm } from "./itineraryForm.js";
import { renderItineraryList } from "./itineraryList.js";
import { renderParkCard } from "./parkCard.js";
import { renderParkDetail } from "./parkDetail.js";
import { getAllTrips } from "./storage.js";

export function renderParkResults(parks = []) {
  if (!parks.length) {
    return `<p>No parks found yet. Try searching by park name or state.</p>`;
  }

  return `<div class="park-results">${parks.map(renderParkCard).join("")}</div>`;
}

export function renderParkDetails(park = null, weather = null, alerts = []) {
  if (!park) {
    return `<p>Select a park to see the details, weather, and alerts.</p>`;
  }

  const weatherHtml = weather
    ? `
      <section class="detail-group">
        <h3>Weather</h3>
        <p><strong>Current temperature:</strong> ${weather.current.temperature ?? "Not available"}°F</p>
        <p><strong>Wind speed:</strong> ${weather.current.windSpeed ?? "Not available"} mph</p>
      </section>
    `
    : `<p>Weather information is not available right now.</p>`;

  const alertsHtml = alerts.length
    ? `<ul class="alert-list">${alerts.map((alert) => `<li><strong>${alert.title}</strong>${alert.description ? ` - ${alert.description}` : ""}</li>`).join("")}</ul>`
    : `<p>No active alerts were returned for this park.</p>`;

  return `
    ${renderParkDetail(park)}
    ${weatherHtml}
    <section class="detail-group">
      <h3>Alerts</h3>
      ${alertsHtml}
    </section>
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
    <p class="section-description">Search by name or state and open a park profile with one click.</p>
    <form id="park-search-form" class="search-form">
      <label>
        <span>Park name</span>
        <input name="query" type="search" placeholder="Yellowstone" />
      </label>
      <label>
        <span>State code</span>
        <input name="stateCode" type="text" maxlength="2" placeholder="WY" />
      </label>
      <button type="submit">Search parks</button>
    </form>
    <p id="search-status" class="status-message">Search by park name, state, or both.</p>
    <div id="park-results"></div>
  `;

  detailsNode.innerHTML = `
    <h2 class="section-title">Park Details</h2>
    <p class="section-description">Weather and current alerts appear once you choose a park.</p>
    <div id="park-details-panel">
      <p>Select a park to see the details, weather, and alerts.</p>
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
