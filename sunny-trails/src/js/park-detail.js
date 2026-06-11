export function renderParkDetail(park = {}) {
  return `
    <section class="park-detail">
      <h2>${park.name || "Park Details"}</h2>
      <p>${park.description || "Park details will show up here once a park is selected."}</p>
      <p><strong>States:</strong> ${park.states || "Not listed"}</p>
      <p><strong>Designation:</strong> ${park.designation || "Not listed"}</p>
      ${park.directionsUrl ? `<p><a class="inline-action" href="${park.directionsUrl}" target="_blank" rel="noreferrer">Get directions</a></p>` : ""}
    </section>
  `;
}
