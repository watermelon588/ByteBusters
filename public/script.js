// theme change 

document.getElementById("themeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const btn = document.getElementById("themeToggle");
    btn.textContent = document.documentElement.classList.contains("dark")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

// theme toggle modification 

// const themeToggleCheckbox = document.getElementById("themeToggle");

// themeToggleCheckbox.addEventListener("change", () => {
//   document.body.classList.toggle("dark-theme", themeToggleCheckbox.checked);
//   localStorage.setItem("theme", themeToggleCheckbox.checked ? "dark" : "light");
// });

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggleCheckbox.checked = true;
}



// ===== MAP SETUP =====
const map = L.map('map', { zoomControl: true });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

let userMarker, accuracyCircle, watchId;
const ngoLayer = L.layerGroup().addTo(map);
const statusEl = document.getElementById('status');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const radiusEl = document.getElementById('radius');
const refreshBtn = document.getElementById('refresh');

let lastQuery = { lat: null, lng: null, radius: null };
let routeControl = null;
let userLocation = null;

// ===== START TRACKING =====
function startTracking() {
  if (!navigator.geolocation) {
    statusEl.textContent = 'Geolocation not supported.';
    return;
  }
  watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 15000
  });
}

function onPosition(pos) {
  const { latitude: lat, longitude: lng, accuracy } = pos.coords;
  userLocation = [lat, lng];

  if (!userMarker) {
    userMarker = L.marker([lat, lng], { title: 'You are here' }).addTo(map);
    accuracyCircle = L.circle([lat, lng], {
      radius: accuracy,
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.15
    }).addTo(map);
    map.setView([lat, lng], 14);
  } else {
    userMarker.setLatLng([lat, lng]);
    accuracyCircle.setLatLng([lat, lng]).setRadius(accuracy);
  }

  statusEl.textContent = `Live: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${Math.round(accuracy)}m)`;

  const r = Number(radiusEl.value);
  if (shouldQuery(lat, lng, r)) {
    fetchNGOs(lat, lng, r);
    lastQuery = { lat, lng, radius: r };
  }
}

function onGeoError(err) {
  statusEl.textContent = 'Location error: ' + err.message;
}

// ===== UTILS =====
function distMeters(lat1, lng1, lat2, lng2) {
  const toRad = d => d * Math.PI / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function shouldQuery(lat, lng, r) {
  if (lastQuery.lat === null) return true;
  const moved = distMeters(lat, lng, lastQuery.lat, lastQuery.lng);
  return moved > 200 || r !== lastQuery.radius;
}

// ===== FETCH NGOs =====
async function fetchNGOs(lat, lng, radiusMeters) {
  statusEl.textContent = 'Searching NGOs…';
  const q = `
    [out:json][timeout:30];
    (
      node(around:${radiusMeters},${lat},${lng})["office"="ngo"];
      way(around:${radiusMeters},${lat},${lng})["office"="ngo"];
      relation(around:${radiusMeters},${lat},${lng})["office"="ngo"];

      node(around:${radiusMeters},${lat},${lng})["non_profit"="yes"];
      way(around:${radiusMeters},${lat},${lng})["non_profit"="yes"];
      relation(around:${radiusMeters},${lat},${lng})["non_profit"="yes"];

      node(around:${radiusMeters},${lat},${lng})["charity"];
      way(around:${radiusMeters},${lat},${lng})["charity"];
      relation(around:${radiusMeters},${lat},${lng})["charity"];
    );
    out center tags;
  `.trim();

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: 'data=' + encodeURIComponent(q)
    });
    const json = await res.json();
    renderResults(json.elements || []);
    statusEl.textContent = 'Done.';
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'Search failed. Try again.';
  }
}

// ===== RENDER RESULTS =====
function renderResults(elements) {
  ngoLayer.clearLayers();
  listEl.innerHTML = '';
  countEl.textContent = elements.length;

  if (!elements.length) return;

  elements.forEach((el) => {
    const tags = el.tags || {};
    const name = tags.name || 'Unnamed NGO';
    const lat = el.lat || el.center?.lat;
    const lng = el.lon || el.center?.lon;
    if (lat == null || lng == null) return;

    const website = tags.website || tags['contact:website'];
    const phone = tags.phone || tags['contact:phone'];
    const addr = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
                  .filter(Boolean).join(' ') || tags['addr:full'] || '';

    const m = L.marker([lat, lng]).addTo(ngoLayer);
    const popupHtml = `
      <strong>${escapeHtml(name)}</strong><br/>
      ${addr ? escapeHtml(addr) + '<br/>' : ''}
      ${phone ? '📞 ' + escapeHtml(phone) + '<br/>' : ''}
      ${website ? `<a href="${escapeAttr(website)}" target="_blank" rel="noopener">Website</a>` : ''}
    `;
    m.bindPopup(popupHtml);

    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `
      <div class="name">${escapeHtml(name)}</div>
      <div class="meta">
        ${addr ? escapeHtml(addr) + ' • ' : ''}${phone ? '📞 ' + escapeHtml(phone) : ''}
      </div>
    `;
    div.addEventListener('click', () => {
      map.setView([lat, lng], 16);
      m.openPopup();
      showRouteTo(lat, lng, name);
    });
    listEl.appendChild(div);
  });
}

// ===== ROUTE FEATURE =====
function showRouteTo(lat, lng, name) {
  if (!userLocation) {
    alert("User location not available yet!");
    return;
  }

  if (routeControl) {
    map.removeControl(routeControl);
  }

  routeControl = L.Routing.control({
    waypoints: [
      L.latLng(userLocation[0], userLocation[1]),
      L.latLng(lat, lng)
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    show: false
  }).addTo(map);

  const from = L.latLng(userLocation[0], userLocation[1]);
  const to = L.latLng(lat, lng);
  const distance = from.distanceTo(to) / 1000; // km

  alert(`Distance to ${name}: ${distance.toFixed(2)} km`);
}

// ===== ESCAPE HTML HELPERS =====
function escapeHtml(s='') {
  return s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
function escapeAttr(s='') { return s.replace(/"/g, '&quot;'); }

// ===== EVENTS =====
refreshBtn.addEventListener('click', () => {
  if (!userMarker) return;
  const { lat, lng } = userMarker.getLatLng();
  fetchNGOs(lat, lng, Number(radiusEl.value));
});
radiusEl.addEventListener('change', () => {
  if (!userMarker) return;
  const { lat, lng } = userMarker.getLatLng();
  fetchNGOs(lat, lng, Number(radiusEl.value));
});

// ===== START =====
startTracking();
