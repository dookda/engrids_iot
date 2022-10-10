let map = L.map("map", {
    center: [18.59805218471816, 98.78567840889879],
    zoom: 13
})

let CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

CartoDB_Positron.addTo(map)

map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
    drawCircleMarker: false,
    drawText: false
});

map.on("pm:create", (e) => {
    let geojson = e.layer.toGeoJSON()
    console.log(geojson);
})

