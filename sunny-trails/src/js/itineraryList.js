export function renderItineraryList(items = []) {
  if (!items.length) {
    return "<p>No saved trips yet. Search for a park and save one!</p>";
  }

  const rows = items
    .map(
      (item) => `
    <li class="trip-item" data-trip-id="${item.id || ""}">
      <div>
        <h4>${item.name || "Untitled trip"}</h4>
        <p>
          ${item.startDate ? `<strong>Start:</strong> ${item.startDate}` : ""}
          ${item.endDate ? ` | <strong>End:</strong> ${item.endDate}` : ""}
        </p>
        ${item.parkCode ? `<p><strong>Park:</strong> ${item.parkCode}</p>` : ""}
        ${item.notes ? `<p>${item.notes}</p>` : ""}
      </div>
      <div class="trip-actions">
        <button type="button" class="edit-trip" data-trip-id="${item.id || ""}">Edit</button>
        <button type="button" class="delete-trip" data-trip-id="${item.id || ""}">Delete</button>
      </div>
    </li>
  `
    )
    .join("");

  return `<ul class="trip-list">${rows}</ul>`;
}
