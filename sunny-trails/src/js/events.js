import { getParkAlerts, getParkByCode, searchParks } from "./park-service.js";
import { getWeatherForecast } from "./weather-service.js";
import { renderParkDetail } from "./park-detail.js";
import { renderAlertsPanel, renderParkResults, renderWeatherPanel } from "./ui.js";
import { getAllTrips, saveTrip, deleteTrip } from "./storage.js";
import { renderItineraryForm } from "./itinerary-form.js";
import { renderItineraryList } from "./itinerary-list.js";

const STATE_NAME_TO_CODE = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
  "district of columbia": "DC",
  "washington dc": "DC",
  "d c": "DC",
  "puerto rico": "PR",
  guam: "GU",
  "american samoa": "AS",
  "northern mariana islands": "MP",
  "virgin islands": "VI",
  "us virgin islands": "VI",
};

function normalizeStateToken(value) {
  const raw = String(value || "").trim();
  if (!raw) return { code: "", valid: true };

  if (/^[a-z]{2}$/i.test(raw)) {
    return { code: raw.toUpperCase(), valid: true };
  }

  const normalizedName = raw
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const mappedCode = STATE_NAME_TO_CODE[normalizedName];
  if (mappedCode) {
    return { code: mappedCode, valid: true };
  }

  return { code: "", valid: false };
}

function normalizeStateInput(inputValue) {
  const tokens = String(inputValue || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    return { stateCode: "", invalid: [] };
  }

  const codes = [];
  const invalid = [];

  tokens.forEach((token) => {
    const normalized = normalizeStateToken(token);
    if (normalized.valid && normalized.code) {
      codes.push(normalized.code);
    } else if (!normalized.valid) {
      invalid.push(token);
    }
  });

  return {
    stateCode: [...new Set(codes)].join(","),
    invalid,
  };
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parkNameMatchesQuery(parkName, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const normalizedParkName = normalizeSearchText(parkName);
  if (!normalizedParkName) return false;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  return queryTokens.every((token) => normalizedParkName.includes(token));
}

function activityMatchesQuery(activities, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const activityNames = Array.isArray(activities)
    ? activities.map((activity) => normalizeSearchText(activity)).filter(Boolean)
    : [];

  if (!activityNames.length) {
    return false;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  return queryTokens.every((token) =>
    activityNames.some((activityName) => activityName.includes(token))
  );
}

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
      alert("Please add a name for your trip.");
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
    alert(`Saved "${trip.name}".`);
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
      if (confirm("Delete this trip from your saved itinerary?")) {
        deleteTrip(tripId);
        refreshItineraryDisplay();
      }
    });
  });
}

export function registerEventHandlers() {
  const searchForm = document.getElementById("park-search-form");
  const clearFiltersButton = document.getElementById("clear-filters-button");
  const searchStatus = document.getElementById("search-status");
  const resultsNode = document.getElementById("park-results");
  const detailsNode = document.getElementById("park-details-panel");
  const itinerarySection = document.getElementById("itinerary");

  if (!searchForm || !searchStatus || !resultsNode || !detailsNode || !itinerarySection) {
    return;
  }

  let activeDetailsRequestId = 0;
  let allParks = [];
  let parksLoaded = false;

  function renderDefaultDetailsState() {
    detailsNode.innerHTML = "<p>Select a park to view details, weather, and alerts.</p>";
  }

  function clearSelectedParkDetails() {
    // Invalidate any in-flight detail/weather/alerts request chain.
    activeDetailsRequestId += 1;
    renderDefaultDetailsState();
  }

  function attachClearSelectionHandler() {
    const clearSelectionButton = detailsNode.querySelector("#clear-selection-button");
    if (!clearSelectionButton) return;

    clearSelectionButton.addEventListener("click", () => {
      clearSelectedParkDetails();
    });
  }

  function renderResultsAndAttachHandlers(parks) {
    resultsNode.innerHTML = renderParkResults(parks);

    const buttons = resultsNode.querySelectorAll("button[data-park-code]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        showParkDetails(button.dataset.parkCode);
      });
    });
  }

  function applyLocalFilters({ query = "", stateCode = "", activityQuery = "" } = {}) {
    return allParks.filter((park) => {
      const matchesName = parkNameMatchesQuery(park.name, query);
      const matchesActivity = activityMatchesQuery(park.activities, activityQuery);

      let matchesState = true;
      if (stateCode) {
        const parkStates = String(park.states || "")
          .split(",")
          .map((value) => value.trim().toUpperCase())
          .filter(Boolean);

        const requestedStates = stateCode
          .split(",")
          .map((value) => value.trim().toUpperCase())
          .filter(Boolean);

        matchesState = requestedStates.every((state) => parkStates.includes(state));
      }

      return matchesName && matchesState && matchesActivity;
    });
  }

  async function preloadAllParks() {
    parksLoaded = false;
    searchStatus.textContent = "Loading parks...";

    try {
      const pageSize = 50;
      const maxPages = 40;
      const parks = [];

      for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
        const start = pageIndex * pageSize;
        const page = await searchParks({
          sort: "fullName",
          limit: pageSize,
          start,
        });

        parks.push(...page);
        renderResultsAndAttachHandlers(parks);
        searchStatus.textContent = `Loaded ${parks.length} park${parks.length === 1 ? "" : "s"} so far...`;

        if (page.length < pageSize) {
          break;
        }
      }

      allParks = parks;
      parksLoaded = true;
      searchStatus.textContent = `${allParks.length} parks loaded. Use the filters to narrow results.`;
    } catch (error) {
      searchStatus.textContent = `Could not load parks: ${error.message}`;
      resultsNode.innerHTML = "";
    }
  }

  async function showParkDetails(parkCode) {
    const requestId = ++activeDetailsRequestId;
    const detailsHelper = document.getElementById("details-helper");
    if (detailsHelper) {
      detailsHelper.remove();
    }

    detailsNode.innerHTML = "<p>Loading park details...</p>";

    try {
      const park = await getParkByCode(parkCode);

      if (requestId !== activeDetailsRequestId) {
        return;
      }

      if (!park || !park.parkCode) {
        throw new Error("No park details were returned for that selection.");
      }

      detailsNode.innerHTML = `
        <div class="details-toolbar">
          <button
            type="button"
            id="clear-selection-button"
            class="details-close-button"
            aria-label="Clear selected park"
            title="Clear selection"
          >X</button>
        </div>
        ${renderParkDetail(park)}
        ${renderWeatherPanel(null, { loading: true, sectionId: "weather-panel" })}
        ${renderAlertsPanel([], { loading: true, sectionId: "alerts-panel" })}
      `;
      attachClearSelectionHandler();

      getWeatherForecast({
        latitude: park.latitude,
        longitude: park.longitude,
      })
        .then((weather) => {
          if (requestId !== activeDetailsRequestId) {
            return;
          }

          const weatherPanel = detailsNode.querySelector("#weather-panel");
          if (!weatherPanel) {
            return;
          }

          weatherPanel.outerHTML = renderWeatherPanel(weather, {
            sectionId: "weather-panel",
          });
        })
        .catch((error) => {
          if (requestId !== activeDetailsRequestId) {
            return;
          }

          const weatherPanel = detailsNode.querySelector("#weather-panel");
          if (!weatherPanel) {
            return;
          }

          weatherPanel.outerHTML = renderWeatherPanel(null, {
            errorMessage: error.message,
            sectionId: "weather-panel",
          });
        });

      getParkAlerts(parkCode)
        .then((alerts) => {
          if (requestId !== activeDetailsRequestId) {
            return;
          }

          const alertsPanel = detailsNode.querySelector("#alerts-panel");
          if (!alertsPanel) {
            return;
          }

          alertsPanel.outerHTML = renderAlertsPanel(alerts, {
            sectionId: "alerts-panel",
          });
        })
        .catch((error) => {
          if (requestId !== activeDetailsRequestId) {
            return;
          }

          const alertsPanel = detailsNode.querySelector("#alerts-panel");
          if (!alertsPanel) {
            return;
          }

          alertsPanel.outerHTML = renderAlertsPanel([], {
            errorMessage: error.message,
            sectionId: "alerts-panel",
          });
        });
    } catch (error) {
      detailsNode.innerHTML = `<p>We could not load that park right now. ${error.message}</p>`;
    }
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(searchForm);
    const query = String(formData.get("query") || "").trim();
    const rawStateInput = String(formData.get("stateCode") || "").trim();
    const activityQuery = String(formData.get("activity") || "").trim();
    const { stateCode, invalid } = normalizeStateInput(rawStateInput);

    if (invalid.length) {
      const badValues = invalid.join(", ");
      searchStatus.textContent = `These state entries were not recognized: ${badValues}. Try a two-letter code (WY) or full name (Wyoming).`;
      resultsNode.innerHTML = "";
      return;
    }

    if (!parksLoaded) {
      searchStatus.textContent = "Parks are still loading. Try again in a moment.";
      return;
    }

    const filteredParks = applyLocalFilters({ query, stateCode, activityQuery });
    renderResultsAndAttachHandlers(filteredParks);

    searchStatus.textContent = filteredParks.length
      ? `Showing ${filteredParks.length} park${filteredParks.length === 1 ? "" : "s"}.`
      : "No parks match those filters. Try changing name, state, or activity.";
  });

  if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
      searchForm.reset();

      if (!parksLoaded) {
        searchStatus.textContent = "Parks are still loading. Filters will be ready once loading finishes.";
        return;
      }

      renderResultsAndAttachHandlers(allParks);
      searchStatus.textContent = `Showing all ${allParks.length} park${allParks.length === 1 ? "" : "s"}.`;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const clearSelectionButton = detailsNode.querySelector("#clear-selection-button");
    if (!clearSelectionButton) {
      return;
    }

    clearSelectedParkDetails();
  });

  attachFormHandlers();
  attachListHandlers();
  preloadAllParks();
}
