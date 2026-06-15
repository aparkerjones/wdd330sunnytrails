import { escapeHtml } from "./utilities.js";

export function renderItineraryForm(trip = null) {
  const id = escapeHtml(trip?.id || "");
  const name = escapeHtml(trip?.name || "");
  const parkCode = escapeHtml(trip?.parkCode || "");
  const startDate = escapeHtml(trip?.startDate || "");
  const endDate = escapeHtml(trip?.endDate || "");
  const notes = escapeHtml(trip?.notes || "");
  const gearChecklist = Array.isArray(trip?.gearChecklist)
    ? trip.gearChecklist.join("\n")
    : String(trip?.gearChecklist || "");
  const safeGearChecklist = escapeHtml(gearChecklist);

  return `
    <form id="itinerary-form" class="itinerary-form">
      <input type="hidden" name="tripId" value="${id}" />
      
      <fieldset>
        <legend>Trip Details</legend>
        
        <label>
          <span>Trip name *</span>
          <input name="tripName" type="text" value="${name}" required />
        </label>
        
        <label>
          <span>Park code</span>
          <input name="parkCode" type="text" value="${parkCode}" placeholder="e.g., yell" />
        </label>
        
        <label>
          <span>Start date</span>
          <input name="startDate" type="date" value="${startDate}" />
        </label>
        
        <label>
          <span>End date</span>
          <input name="endDate" type="date" value="${endDate}" />
        </label>
        
        <label>
          <span>Trip notes</span>
          <textarea name="notes" placeholder="What to bring, activities planned, etc.">${notes}</textarea>
        </label>

        <label>
          <span>Gear checklist</span>
          <textarea
            name="gearChecklist"
            placeholder="One item per line, e.g.\nTent\nWater filter\nFirst aid kit"
          >${safeGearChecklist}</textarea>
        </label>
      </fieldset>

      <div class="form-actions">
        <button type="submit">${trip ? "Update trip" : "Save new trip"}</button>
        ${trip ? `<button type="button" id="cancel-edit">Cancel</button>` : ""}
      </div>
    </form>
  `;
}
