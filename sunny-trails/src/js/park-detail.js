export function renderParkDetail(park = {}) {
  const activitiesText = Array.isArray(park.activities) && park.activities.length
    ? park.activities.join(", ")
    : "Not listed";

  return `
    <section class="park-detail">
      <h2>${park.name || "Park Details"}</h2>
      <p>${park.description || "Park details will appear here once you select a park."}</p>
      <p><strong>States:</strong> ${park.states || "Not listed"}</p>
      <p><strong>Designation:</strong> ${park.designation || "Not listed"}</p>
      <p><strong>Activities:</strong> ${activitiesText}</p>
      ${park.directionsUrl ? `<p><a class="inline-action" href="${park.directionsUrl}" target="_blank" rel="noreferrer">Get directions</a></p>` : ""}
    </section>
  `;
}
