/**
 * WOW Locations Map – Fixed version (no more tiny map!)
 */

(function () {
  'use strict';

  const mapDiv = document.getElementById('map');
  const loadingDiv = document.getElementById('loading');

  if (!mapDiv) {
    console.error('Map div not found!');
    return;
  }

  // Start with the div visible AND with a proper height
  mapDiv.style.display = 'block';
  mapDiv.style.height = '600px';   // ← CRUCIAL
  mapDiv.style.width = '100%';
  if (loadingDiv) loadingDiv.style.display = 'none';

  // NOW it’s safe to create the map – the container already has size!
  const map = L.map('map').setView([51.47, -2.59], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Fetch and plot locations
  fetch('/api/locations')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
      return res.json();
    })
    .then(locations => {
      if (locations.length === 0) {
        document.getElementById('locations-details').innerHTML = '<p>No locations found.</p>';
        return;
      }

      const bounds = L.latLngBounds();

      locations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          const lat = parseFloat(loc.latitude);
          const lng = parseFloat(loc.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(`
              <b>${loc.name || 'Location'}</b><br>
              ${loc.postcode || ''}<br>
              <small>${lat.toFixed(5)}, ${lng.toFixed(5)}</small>
            `);
            bounds.extend([lat, lng]);
          }
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Populate the list below
      document.getElementById('locations-details').innerHTML = locations
        .map(loc => `
          <div style="padding:12px; border-bottom:1px solid #eee;">
            <strong>${loc.name || 'Unnamed'}</strong> – ${loc.postcode || ''}
            <br><small>${parseFloat(loc.latitude).toFixed(5)}, ${parseFloat(loc.longitude).toFixed(5)}</small>
          </div>
        `).join('');
    })
    .catch(err => {
      console.error(err);
      mapDiv.innerHTML = `<p style="color:red; text-align:center;">Map failed to load: ${err.message}</p>`;
    });

})();