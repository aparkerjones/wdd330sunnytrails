export function renderParkCard(park = {}) {
  const firstImage = park.images?.[0];

  return `
    <article class="park-card">
      ${firstImage?.url ? `<img src="${firstImage.url}" alt="${firstImage.altText || park.name || "Park image"}" class="park-card-image" />` : ""}
      <h3>${park.name || "Park Name"}</h3>
      <p class="park-meta">${park.designation || "National Park"}</p>
      <p class="park-meta">${park.states || park.state || "State"}</p>
      <button type="button" data-park-code="${park.parkCode || ""}">View details</button>
    </article>
  `;
}
