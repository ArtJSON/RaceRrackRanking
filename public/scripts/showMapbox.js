mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 0],
    zoom: 0.6,
    projection: 'naturalEarth' // starting projection
});

new mapboxgl.Marker().setLngLat(racetrack.geometry.coordinates).addTo(map);