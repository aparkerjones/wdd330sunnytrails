import { getParkAlerts, getParkByCode, searchParks } from "./park-service.js";
import { getWeatherForecast } from "./weather-service.js";
import { renderParkDetails, renderParkResults } from "./ui.js";
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
  const searchStatus = document.getElementById("search-status");
  const resultsNode = document.getElementById("park-results");
  const detailsNode = document.getElementById("park-details-panel");
  const itinerarySection = document.getElementById("itinerary");

  if (!searchForm || !searchStatus || !resultsNode || !detailsNode || !itinerarySection) {
    return;
  }

  async function showParkDetails(parkCode) {
    const detailsHelper = document.getElementById("details-helper");
    if (detailsHelper) {
      detailsHelper.remove();
    }

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
    const rawStateInput = String(formData.get("stateCode") || "").trim();
    const { stateCode, invalid } = normalizeStateInput(rawStateInput);

    if (invalid.length) {
      const badValues = invalid.join(", ");
      searchStatus.textContent = `I could not match these states: ${badValues}. Try a two-letter code (WY) or full name (Wyoming).`;
      resultsNode.innerHTML = "";
      return;
    }

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
        : "No parks matched that search. Try another park name or state.";
    } catch (error) {
      searchStatus.textContent = `Search failed: ${error.message}`;
      resultsNode.innerHTML = "";
    }
  });

  attachFormHandlers();
  attachListHandlers();
}
