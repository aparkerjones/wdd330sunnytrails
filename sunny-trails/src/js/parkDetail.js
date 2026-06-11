export function renderParkDetail(park = {}) {
  return `<section><h2>${park.name || "Park Details"}</h2><p>${park.description || "Park details will show up here once a park is selected."}</p></section>`;
}
