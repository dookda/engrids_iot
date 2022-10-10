var map = L.map('map', {
    center: [18.59805218471816, 98.78567840889879],
    zoom: 9
});

var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

let baseLayer = {
    OpenStreetMap_Mapnik: OpenStreetMap_Mapnik,
    Esri_WorldImagery: Esri_WorldImagery,
    CartoDB_Positron: CartoDB_Positron.addTo(map)
}

let overLayer = {}

L.control.layers(baseLayer, overLayer).addTo(map)


map.locate({ setView: true, maxZoom: 18 });

function onLocationFound(e) {
    console.log(e);
    L.marker([e.latitude, e.longitude]).addTo(map);
    L.circle([e.latitude, e.longitude], { radius: e.accuracy }).addTo(map);
}

map.on('locationfound', onLocationFound)