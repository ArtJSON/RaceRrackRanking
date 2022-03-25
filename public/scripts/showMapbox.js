mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: racetrack.geometry.coordinates,
    zoom: 14,
    projection: 'mercator' // starting projection
});

console.log(racetrack.geometry.coordinates)

new mapboxgl.Marker().setLngLat(racetrack.geometry.coordinates).addTo(map);