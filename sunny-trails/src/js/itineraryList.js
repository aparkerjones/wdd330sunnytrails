import { escapeHtml } from "./utilities.js";

export function renderItineraryList(items = []) {
  if (!items.length) {
    return "<p>No saved trips yet. Search for a park and save one!</p>";
  }

  const rows = items
    .map((item) => {
      const id = escapeHtml(item.id || "");
      const name = escapeHtml(item.name || "Untitled trip");
      const startDate = escapeHtml(item.startDate || "");
      const endDate = escapeHtml(item.endDate || "");
      const parkCode = escapeHtml(item.parkCode || "");
      const notes = escapeHtml(item.notes || "");

      return `
    <li class="trip-item" data-trip-id="${id}">
      <div>
        <h4>${name}</h4>
        <p>
          ${startDate ? `<strong>Start:</strong> ${startDate}` : ""}
          ${endDate ? ` | <strong>End:</strong> ${endDate}` : ""}
        </p>
        ${parkCode ? `<p><strong>Park:</strong> ${parkCode}</p>` : ""}
        ${notes ? `<p>${notes}</p>` : ""}
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
