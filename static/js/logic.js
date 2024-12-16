<html>
<head>
    <title>Earthquake Visualization</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map { height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="logic.js"></script>
</body>
</html>

// Define the URL for the GeoJSON data
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL
fetch(queryUrl)
    .then(response => response.json())
    .then(data => createMap(data.features));

function createMap(earthquakeData) {
    // Create the map
    const myMap = L.map("map").setView([37.09, -95.71], 5);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(myMap);

    // Loop through the earthquake data and create markers
    earthquakeData.forEach(earthquake => {
        const [longitude, latitude, depth] = earthquake.geometry.coordinates;
        const magnitude = earthquake.properties.mag;

        // Set marker size based on magnitude
        const markerSize = magnitude * 5; // Adjust the multiplier for size
        const color = depth > 30 ? 'red' : depth > 10 ? 'orange' : 'green'; // Color based on depth

        // Create a circle marker
        const marker = L.circleMarker([latitude, longitude], {
            radius: markerSize,
            fillColor: color,
            color: color,
            fillOpacity: 0.6,
            stroke: false
        }).addTo(myMap);

        // Bind a popup to the marker
        marker.bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth} km<br>${earthquake.properties.place}`);
    });

    // Create a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML += '<h4>Depth (km)</h4>';
        div.innerHTML += '<i style="background: green"></i> 0-10<br>';
        div.innerHTML += '<i style="background: orange"></i> 10-30<br>';
        div.innerHTML += '<i style="background: red"></i> 30+<br>';
        return div;
    };
    legend.addTo(myMap);
}