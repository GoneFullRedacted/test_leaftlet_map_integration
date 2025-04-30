// Initialisation de la carte
const map = L.map('map').setView([48.8566, 2.3522], 16); // Paris

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Données des points d'intérêt
const points = [
    { id: 1, name: "Hôtel Central", coords: [48.8566, 2.3522], type: "hotel", image: "hotel-presidente-4s.jpg", description: "Un hôtel confortable au centre-ville."},
    { id: 2, name: "Bar du Coin", coords: [48.8570, 2.3540], type: "bar", image: "bar-paris.jpg", description: "Un superbe bar vintage situé à deux pas d'un endroit magnifique" },
    { id: 3, name: "Restaurant Le Gourmet", coords: [48.8585, 2.3510], type: "restaurant" },
    { id: 4, name: "Tour Eiffel", coords: [48.8584, 2.2945], type: "lieu" },
    { id: 5, name: "Tour Eiffel", coords: [48.8584, 2.2945], type: "lieu" },
    { id: 6, name: "Tour Eiffel", coords: [48.8584, 2.2945], type: "lieu" },
    { id: 7, name: "Tour Eiffel", coords: [48.8584, 2.2945], type: "lieu" }
];

// Légende associée
    const legendContainer = document.getElementById('legend');
    const navItems = document.getElementById('nav-items');

// Gestion bidirectionnelle
    const markers = {};

// Bloc panel
    function showPanel(point) {
    const panel = document.getElementById('info-panel');
    const content = `
      <h2>${point.name}</h2>
      <img src="${point.image || 'placeholder.jpg'}" alt="${point.name}" style="width:100%; max-height:200px; object-fit:cover;">
      <p>${point.description || 'Description non disponible.'}</p>
    `;
    panel.innerHTML = content;
    panel.style.display = 'block';
    }



  // Modifications des marqueurs

    const icons = {
    hotel: L.icon({ iconUrl: 'hotel_marker.svg', iconSize: [50, 70], iconAnchor: [15, 40] }),
    bar: L.icon({ iconUrl: 'bar_marker.svg', iconSize: [50, 70], iconAnchor: [15, 40] }),
    restaurant: L.icon({ iconUrl: 'restaurant_marker.svg', iconSize: [50, 70], iconAnchor: [15, 40] }),
    lieu: L.icon({ iconUrl: 'poi_marker.svg', iconSize: [50, 70], iconAnchor: [15, 40] })
    };

    points.forEach((point, index) => {
    // Création du marqueur

    const marker = L.marker(point.coords, { icon: icons[point.type] }).addTo(map);
    marker.on('click', () => {
    showLegend(point.id);
    showPanel(point);
    });
    markers[point.id] = marker;

    // Création des éléments HTML liés
    const navButton = document.createElement('button');
    navButton.innerText = point.id;
    navButton.dataset.id = point.id;
    navItems.appendChild(navButton);



    const legendItem = document.createElement('div');
    legendItem.id = `legend-${point.id}`;
    legendItem.className = 'legend-item';
    legendItem.innerText = `${point.name} (${point.type})`;
    legendItem.style.display = 'none';
    legendContainer.appendChild(legendItem);

  // Navigation depuis bouton vers carte
    navButton.addEventListener('click', () => {
    map.flyTo(point.coords, 15, { duration: 1.2 });
    marker.openPopup();
    showLegend(point.id);
    showPanel(point);
    });
    });

// Fonction d'affichage de légende unique
    function showLegend(id) {
    document.querySelectorAll('.legend-item').forEach(el => {
    el.style.display = 'none';
  });
    const item = document.getElementById(`legend-${id}`);
    if (item) item.style.display = 'block';
    }


    const orderedCoords = points
  .sort((a, b) => a.id - b.id)
  .map(point => point.coords);


  const tourButton = document.createElement('button');
  tourButton.innerText = 'Tour complet';
  tourButton.addEventListener('click', startTour);
  tourButton.classList.add('tour-button');
  navItems.appendChild(tourButton);
  
L.polyline(orderedCoords, { color: 'blue', weight: 3, smoothFactor: 1 }).addTo(map);

function startTour() {
    points.sort((a, b) => a.id - b.id).forEach((point, index) => {
      setTimeout(() => {
        map.flyTo(point.coords, 15, { duration: 1.5 });
        showLegend(point.id);
        showPanel(point);
      }, index * 3000); // 3 secondes entre chaque arrêt
    });
  }
