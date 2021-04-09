// In this file we enable the map with some key/value pairs in a map object:


// Note the "mapToken" crated before in show.ejs. We then send it back as "mapboxgl.accessToken":
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat], will center in our location
    zoom: 10 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Let's add a marker (pin) to the map:
new mapboxgl.Marker()
// Set Longitude and Latitude:
.setLngLat(campground.geometry.coordinates)
// Set a popup:
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
        // This will show the name of the campground when we click the marker.
    )
)
// Add it to our map object:
.addTo(map)