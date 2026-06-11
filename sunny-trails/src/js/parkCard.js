export function renderParkCard(park = {}) {
  return `
    <article class="park-card">
      <h3>${park.name || "Park Name"}</h3>
      <p>${park.states || park.state || "State"}</p>
      <p>${park.designation || "National Park"}</p>
      <button type="button" data-park-code="${park.parkCode || ""}">View details</button>
    </article>
  `;
}
