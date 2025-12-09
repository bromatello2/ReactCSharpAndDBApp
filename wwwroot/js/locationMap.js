/**
 * Plain JavaScript locations map using Leaflet and Fetch API
 * No build tools or ES6 imports required - runs directly in browser
 */

(function() {
  'use strict';

  // Initialize the map (centered on UK)
  const map = L.map('map').setView([54.5, -2.5], 6);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Fetch locations from API and render
  fetch('/api/locations')
    .then(res => {
      if (!res.ok) throw new Error('API request failed: ' + res.statusText);
      return res.json();
    })
    .then(locations => {
      // Hide loading, show map
      document.getElementById('loading').style.display = 'none';
      document.getElementById('map').style.display = 'block';

      // Add markers to map
      locations.forEach((loc, index) => {
        if (loc.latitude && loc.longitude) {
          const marker = L.marker([loc.latitude, loc.longitude]).addTo(map);
          marker.bindPopup(
            `<strong>${loc.name || 'Location'}</strong><br/>` +
            `Coordinates: ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}<br/>` +
            (loc.description ? `<em>${loc.description}</em>` : '')
          );
        }
      });

      // Render location details list
      const detailsDiv = document.getElementById('locations-details');
      if (locations.length === 0) {
        detailsDiv.innerHTML = '<p style="color: #999;">No locations available.</p>';
      } else {
        detailsDiv.innerHTML = locations.map((loc, i) => `
          <div class="location-card">
            <h3>${loc.name || 'Location'}</h3>
            <p><strong>Coordinates:</strong> ${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}</p>
            ${loc.description ? `<p><strong>Description:</strong> ${loc.description}</p>` : ''}
          </div>
        `).join('');
      }
    })
    .catch(err => {
      console.error('Error loading locations:', err);
      document.getElementById('loading').innerHTML =
        '<div style="color: darkred;"><strong>Error loading locations:</strong> ' + err.message + '</div>';
    });
})();