mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates);

const popup = new mapboxgl.Popup({
    offset: 25,
    className: "map-popup",
    closeButton: false,      // removes the X
    closeOnClick: false,
}).setHTML(`
    <h5>${listing.title}</h5><p class="mb-0">Exact location provided after booking</p>`);

// A custom marker element
const el = document.createElement("div");
el.className = "marker";
el.innerHTML = `<div class="pin"><i class="fa-solid fa-house"></i></div>`;

const marker = new mapboxgl.Marker({
    element: el,
    anchor: "bottom", 
})
.setLngLat(coordinates)
.addTo(map);

// show by default
popup.setLngLat(coordinates).addTo(map);

// show on hover, hide on leave
const markerEl = marker.getElement();
markerEl.style.cursor = "pointer";

let overMarker = false;

markerEl.addEventListener("mouseenter", () => {
    overMarker = true;
    popup.setLngLat(coordinates).addTo(map);
});
markerEl.addEventListener("mouseleave", () => {
    overMarker = false;
    popup.remove();
});

map.getContainer().addEventListener("mouseenter", () => {
    if (!overMarker) {
        popup.remove();
    }
});

map.getContainer().addEventListener("mouseleave", () => {
    overMarker = true;
    popup.setLngLat(coordinates).addTo(map);
    overMarker = false;
});