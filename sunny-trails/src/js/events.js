import { getParkAlerts, getParkByCode, searchParks } from "./parkService.js";
import { getWeatherForecast } from "./weatherService.js";
import { renderParkDetails, renderParkResults } from "./ui.js";
import { getAllTrips, saveTrip, deleteTrip } from "./storage.js";
import { renderItineraryForm } from "./itineraryForm.js";
import { renderItineraryList } from "./itineraryList.js";

function refreshItineraryDisplay() {
  const itineraryNode = document.getElementById("itinerary");
  if (!itineraryNode) return;

  const trips = getAllTrips();
  const formNode = itineraryNode.querySelector("#itinerary-form");
  const listNode = itineraryNode.querySelector("#itinerary-list");

  if (formNode) {
    formNode.outerHTML = renderItineraryForm();
    attachFormHandlers();
  }

  if (listNode) {
    listNode.innerHTML = renderItineraryList(trips);
    attachListHandlers();
  }
}

function attachFormHandlers() {
  const form = document.getElementById("itinerary-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const tripId = String(formData.get("tripId") || "").trim() || null;
    const tripName = String(formData.get("tripName") || "").trim();

    if (!tripName) {
      alert("Please enter a trip name.");
      return;
    }

    const trip = {
      id: tripId,
      name: tripName,
      parkCode: String(formData.get("parkCode") || "").trim(),
      startDate: String(formData.get("startDate") || "").trim(),
      endDate: String(formData.get("endDate") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
    };

    saveTrip(trip);
    alert(`Trip "${trip.name}" saved!`);
    refreshItineraryDisplay();
  });

  const cancelBtn = form.querySelector("#cancel-edit");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      refreshItineraryDisplay();
    });
  }
}

function attachListHandlers() {
  const editButtons = document.querySelectorAll(".edit-trip");
  const deleteButtons = document.querySelectorAll(".delete-trip");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tripId = btn.dataset.tripId;
      const trip = getAllTrips().find((t) => t.id === tripId);
      if (!trip) return;

      const itineraryNode = document.getElementById("itinerary");
      if (!itineraryNode) return;

      const formNode = itineraryNode.querySelector("#itinerary-form");
      if (formNode) {
        formNode.outerHTML = renderItineraryForm(trip);
        attachFormHandlers();
      }
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tripId = btn.dataset.tripId;
      if (confirm("Are you sure you want to delete this trip?")) {
        deleteTrip(tripId);
        refreshItineraryDisplay();
      }
    });
  });
}

export function registerEventHandlers() {
  const searchForm = document.getElementById("park-search-form");
  const searchStatus = document.getElementById("search-status");
  const resultsNode = document.getElementById("park-results");
  const detailsNode = document.getElementById("park-details-panel");
  const itinerarySection = document.getElementById("itinerary");

  if (!searchForm || !searchStatus || !resultsNode || !detailsNode || !itinerarySection) {
    return;
  }

  async function showParkDetails(parkCode) {
    detailsNode.innerHTML = "<p>Loading park details...</p>";

    try {
      const park = await getParkByCode(parkCode);
      const [weather, alerts] = await Promise.all([
        getWeatherForecast({
          latitude: Number(park.latitude),
          longitude: Number(park.longitude),
        }),
        getParkAlerts(parkCode),
      ]);

      detailsNode.innerHTML = renderParkDetails(park, weather, alerts);
    } catch (error) {
      detailsNode.innerHTML = `<p>Sorry, we could not load that park right now. ${error.message}</p>`;
    }
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(searchForm);
    const query = String(formData.get("query") || "").trim();
    const stateCode = String(formData.get("stateCode") || "").trim().toUpperCase();

    searchStatus.textContent = "Searching parks...";
    resultsNode.innerHTML = "";

    try {
      const parks = await searchParks({ query, stateCode, limit: 10 });
      resultsNode.innerHTML = renderParkResults(parks);

      const buttons = resultsNode.querySelectorAll("button[data-park-code]");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          showParkDetails(button.dataset.parkCode);
        });
      });

      searchStatus.textContent = parks.length
        ? `Found ${parks.length} park${parks.length === 1 ? "" : "s"}.`
        : "No parks matched that search.";
    } catch (error) {
      searchStatus.textContent = `Search failed: ${error.message}`;
      resultsNode.innerHTML = "";
    }
  });

  attachFormHandlers();
  attachListHandlers();
}
