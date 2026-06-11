export function renderParkCard(park = {}) {
  const firstImage = park.images?.[0];
  const stateCodes = String(park.states || park.state || "State")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

  return `
    <article class="park-card">
      ${firstImage?.url ? `<img src="${firstImage.url}" alt="${firstImage.altText || park.name || "Park image"}" class="park-card-image" />` : ""}
      <h3>${park.name || "Park Name"}</h3>
      <p class="park-meta">${park.designation || "National Park"}</p>
      <p class="park-meta">${stateCodes}</p>
      <button type="button" data-park-code="${park.parkCode || ""}">View details</button>
    </article>
  `;
}
