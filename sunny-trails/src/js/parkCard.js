export function renderParkCard(park = {}) {
  return `<article><h3>${park.name || "Park Name"}</h3><p>${park.state || "State"}</p></article>`;
}
