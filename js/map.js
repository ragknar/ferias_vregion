let map;
let markerCluster;

export function initMap(ferias) {
  map = L.map('map').setView([-33.05, -71.4], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markerCluster = L.markerClusterGroup();
  updateMarkers(ferias);
}

export function updateMarkers(ferias) {
  if (!markerCluster) return;
  
  markerCluster.clearLayers();
  
  ferias.forEach(f => {
    const marker = L.marker([f.lat, f.lng]);
    marker.bindPopup(`
      <b>${f.nombre}</b><br>
      ${f.comuna}<br>
      📅 ${f.dias.join(", ")}<br>
      ⏰ ${f.horario}
    `);
    markerCluster.addLayer(marker);
  });

  map.addLayer(markerCluster);
  if (ferias.length > 0) {
    map.fitBounds(markerCluster.getBounds());
  }
}
