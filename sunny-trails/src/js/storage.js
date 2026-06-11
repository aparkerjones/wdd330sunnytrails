const STORAGE_KEY = "sunny-trails-state";

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { trips: [] };
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getAllTrips() {
  const state = loadState();
  return Array.isArray(state.trips) ? state.trips : [];
}

export function saveTrip(trip) {
  if (!trip.id) {
    trip.id = generateId();
  }

  const state = loadState();
  state.trips = Array.isArray(state.trips) ? state.trips : [];

  const index = state.trips.findIndex((t) => t.id === trip.id);
  if (index >= 0) {
    state.trips[index] = trip;
  } else {
    state.trips.push(trip);
  }

  saveState(state);
  return trip;
}

export function deleteTrip(tripId) {
  const state = loadState();
  state.trips = (Array.isArray(state.trips) ? state.trips : []).filter((t) => t.id !== tripId);
  saveState(state);
}

export function getTripById(tripId) {
  const trips = getAllTrips();
  return trips.find((t) => t.id === tripId) || null;
}
