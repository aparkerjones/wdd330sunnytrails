import { escapeHtml } from "./utilities.js";

export function renderItineraryList(items = []) {
  if (!items.length) {
    return "<p>You have no saved trips yet. Find a park and save your first one.</p>";
  }

  const rows = items
    .map((item) => {
      const id = escapeHtml(item.id || "");
      const name = escapeHtml(item.name || "Untitled trip");
      const startDate = escapeHtml(item.startDate || "");
      const endDate = escapeHtml(item.endDate || "");
      const parkName = escapeHtml(item.parkName || "");
      const notes = escapeHtml(item.notes || "");
      const checklistItems = Array.isArray(item.gearChecklist)
        ? item.gearChecklist.map((entry) => escapeHtml(entry || "")).filter(Boolean)
        : [];
      const checklistMarkup = checklistItems.length
        ? `
          <div class="trip-gear">
            <strong>Gear checklist:</strong>
            <ul>
              ${checklistItems.map((entry) => `<li>${entry}</li>`).join("")}
            </ul>
          </div>
        `
        : "";

      return `
    <li class="trip-item" data-trip-id="${id}">
      <div>
        <h4>${name}</h4>
        <p>
          ${startDate ? `<strong>Start:</strong> ${startDate}` : ""}
          ${endDate ? ` | <strong>End:</strong> ${endDate}` : ""}
        </p>
        ${parkName ? `<p><strong>Park:</strong> ${parkName}</p>` : ""}
        ${notes ? `<p>${notes}</p>` : ""}
        ${checklistMarkup}
      </div>
      <div class="trip-actions">
        <button type="button" class="edit-trip" data-trip-id="${id}">Edit</button>
        <button type="button" class="delete-trip" data-trip-id="${id}">Delete</button>
      </div>
    </li>
  `;
    })
    .join("");

  return `<ul class="trip-list">${rows}</ul>`;
}
