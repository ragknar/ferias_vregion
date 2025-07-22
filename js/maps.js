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
  markerCluster.clearLayers();
  
  const markers = ferias.map(f => {
    const marker = L.marker([f.lat, f.lng]);
    marker.bindPopup(`
      <strong>${f.nombre}</strong><br>
      ${f.comuna}<br>
      Días: ${f.dias.join(", ")}<br>
      Horario: ${f.horario}
    `);
    return marker;
  });

  markerCluster.addLayers(markers);
  map.addLayer(markerCluster);
  
  if (ferias.length > 0) {
    map.fitBounds(markerCluster.getBounds());
  }
}