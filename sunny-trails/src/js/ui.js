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
      <section>
        <h3>Weather</h3>
        <p><strong>Current temperature:</strong> ${weather.current.temperature ?? "Not available"}°F</p>
        <p><strong>Wind speed:</strong> ${weather.current.windSpeed ?? "Not available"} mph</p>
      </section>
    `
    : `<p>Weather information is not available right now.</p>`;

  const alertsHtml = alerts.length
    ? `<ul>${alerts.map((alert) => `<li><strong>${alert.title}</strong>${alert.description ? ` - ${alert.description}` : ""}</li>`).join("")}</ul>`
    : `<p>No active alerts were returned for this park.</p>`;

  return `
    ${renderParkDetail(park)}
    ${weatherHtml}
    <section>
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
    <h2>Search parks</h2>
    <form id="park-search-form">
      <label>
        Park name
        <input name="query" type="search" placeholder="Yellowstone" />
      </label>
      <label>
        State code
        <input name="stateCode" type="text" maxlength="2" placeholder="WY" />
      </label>
      <button type="submit">Search parks</button>
    </form>
    <p id="search-status">Search by park name, state, or both.</p>
    <div id="park-results"></div>
  `;

  detailsNode.innerHTML = `
    <h2>Park details</h2>
    <div id="park-details-panel">
      <p>Select a park to see the details, weather, and alerts.</p>
    </div>
  `;

  const trips = getAllTrips();

  itineraryNode.innerHTML = `
    <h2>Itinerary</h2>
    ${renderItineraryForm()}
    <div id="itinerary-list">
      ${renderItineraryList(trips)}
    </div>
  `;
}
