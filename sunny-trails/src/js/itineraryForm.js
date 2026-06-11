export function renderItineraryForm(trip = null) {
  const id = trip?.id || "";
  const name = trip?.name || "";
  const parkCode = trip?.parkCode || "";
  const startDate = trip?.startDate || "";
  const endDate = trip?.endDate || "";
  const notes = trip?.notes || "";

  return `
    <form id="itinerary-form" class="itinerary-form">
      <input type="hidden" name="tripId" value="${id}" />
      
      <fieldset>
        <legend>Trip Details</legend>
        
        <label>
          Trip name *
          <input name="tripName" type="text" value="${name}" required />
        </label>
        
        <label>
          Park code
          <input name="parkCode" type="text" value="${parkCode}" placeholder="e.g., yell" />
        </label>
        
        <label>
          Start date
          <input name="startDate" type="date" value="${startDate}" />
        </label>
        
        <label>
          End date
          <input name="endDate" type="date" value="${endDate}" />
        </label>
        
        <label>
          Trip notes
          <textarea name="notes" placeholder="What to bring, activities planned, etc.">${notes}</textarea>
        </label>
      </fieldset>
      
      <button type="submit">${trip ? "Update trip" : "Save new trip"}</button>
      ${trip ? `<button type="button" id="cancel-edit">Cancel</button>` : ""}
    </form>
  `;
}
