import { initMap, updateMarkers } from './map.js';

let ferias = [];

async function loadFerias() {
  try {
    const response = await fetch('../data/ferias.json');
    ferias = await response.json();
    initFilters();
    initMap(ferias);
  } catch (error) {
    console.error("Error cargando ferias:", error);
  }
}

function initFilters() {
  const comunas = [...new Set(ferias.map(f => f.comuna))];
  const comunaFilter = document.getElementById('comunaFilter');
  
  comunas.forEach(comuna => {
    const option = document.createElement('option');
    option.value = comuna;
    option.textContent = comuna;
    comunaFilter.appendChild(option);
  });

  // Días predefinidos para evitar inconsistencia
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const diaFilter = document.getElementById('diaFilter');
  
  dias.forEach(dia => {
    const option = document.createElement('option');
    option.value = dia;
    option.textContent = dia;
    diaFilter.appendChild(option);
  });

  // Eventos
  document.getElementById('comunaFilter').addEventListener('change', filterFerias);
  document.getElementById('diaFilter').addEventListener('change', filterFerias);
  
  // Botón de geolocalización
  document.getElementById('geolocateBtn').addEventListener('click', locateUser);
}

function filterFerias() {
  const comuna = document.getElementById('comunaFilter').value;
  const dia = document.getElementById('diaFilter').value;
  
  const filtered = ferias.filter(f => 
    (comuna === 'todas' || f.comuna === comuna) &&
    (dia === 'todos' || f.dias.some(d => d.toLowerCase().includes(dia.toLowerCase())))
  );

  updateMarkers(filtered);
  document.getElementById('noResults').classList.toggle('hidden', filtered.length > 0);
}

function locateUser() {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización");
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      map.flyTo([position.coords.latitude, position.coords.longitude], 14);
      L.marker([position.coords.latitude, position.coords.longitude])
        .addTo(map)
        .bindPopup("¡Estás aquí!")
        .openPopup();
    },
    (error) => {
      alert(`Error al obtener ubicación: ${error.message}`);
    },
    { timeout: 10000 }
  );
}

document.addEventListener('DOMContentLoaded', loadFerias);
