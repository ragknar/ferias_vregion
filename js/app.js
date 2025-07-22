// Carga datos y maneja filtros
import { initMap, updateMarkers } from './map.js';

let ferias = [];

async function loadFerias() {
  try {
    const response = await fetch('data/ferias.json');
    ferias = await response.json();
    initFilters();
    initMap(ferias);
  } catch (error) {
    console.error("Error cargando ferias:", error);
  }
}

function initFilters() {
  // Genera opciones únicas de comunas
  const comunas = [...new Set(ferias.map(f => f.comuna))];
  const comunaFilter = document.getElementById('comunaFilter');
  
  comunas.forEach(comuna => {
    const option = document.createElement('option');
    option.value = comuna;
    option.textContent = comuna;
    comunaFilter.appendChild(option);
  });

  // Configura eventos
  document.getElementById('comunaFilter').addEventListener('change', filterFerias);
  document.getElementById('diaFilter').addEventListener('change', filterFerias);
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
  // Implementación en map.js
}

document.addEventListener('DOMContentLoaded', loadFerias);
