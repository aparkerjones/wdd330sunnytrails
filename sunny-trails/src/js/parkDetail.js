export function renderParkDetail(park = {}) {
  const firstImage = park.images?.[0];

  return `
    <section class="park-detail">
      <h2>${park.name || "Park Details"}</h2>
      ${firstImage?.url ? `<img src="${firstImage.url}" alt="${firstImage.altText || park.name || "Park image"}" style="width:100%;height:auto;border-radius:12px;" />` : ""}
      <p>${park.description || "Park details will show up here once a park is selected."}</p>
      <p><strong>States:</strong> ${park.states || "Not listed"}</p>
      <p><strong>Designation:</strong> ${park.designation || "Not listed"}</p>
      ${park.directionsUrl ? `<p><a href="${park.directionsUrl}" target="_blank" rel="noreferrer">Get directions</a></p>` : ""}
    </section>
  `;
}
