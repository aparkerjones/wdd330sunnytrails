export function renderItineraryList(items = []) {
  if (!items.length) {
    return "<p>No saved trips yet.</p>";
  }

  const rows = items.map((item) => `<li>${item.name}</li>`).join("");
  return `<ul>${rows}</ul>`;
}
