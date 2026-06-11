import { renderItineraryForm } from "./itineraryForm.js";
import { renderItineraryList } from "./itineraryList.js";

export function initializeUi() {
  const itineraryNode = document.getElementById("itinerary");
  if (!itineraryNode) {
    return;
  }

  itineraryNode.innerHTML = `
    <h2>Itinerary</h2>
    ${renderItineraryForm()}
    ${renderItineraryList()}
  `;
}
