export function registerEventHandlers() {
  const itinerarySection = document.getElementById("itinerary");
  if (!itinerarySection) {
    return;
  }

  itinerarySection.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Trip saving is still coming in Week 6.");
  });
}
