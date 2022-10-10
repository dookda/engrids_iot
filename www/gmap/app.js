let map
let center = { lat: 18.790436543994158, lng: 98.95692830465246 }
let markers = []
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), { zoom: 14, center: center })
    let mk = new google.maps.Marker({ position: center })
    // loadMarker()
    mk.setMap(map)
    markers.push(mk)

    map.addListener("click", function (e) {
        let pos = e.latLng.toJSON()
        let mk = new google.maps.Marker({ position: pos })
        // loadMarker()
        mk.setMap(map)
        markers.push(mk)
    })
}

function loadMarker(latlng) {
    new google.maps.Marker({
        position: latlng,
        map: map,
        title: "hello map"
    })
}

function getMylocation() {
    navigator.geolocation.getCurrentPosition((e) => {
        let pos = { lat: e.coords.latitude, lng: e.coords.longitude }
        // loadMarker(pos)
        let mk = new google.maps.Marker({ position: pos })
        mk.setMap(map)
        markers.push(mk)

        map.panTo(pos)
        map.setZoom(16)
    })
}


function removeMarker() {
    markers.forEach(i => {
        console.log(i);
        i.setMap(null)
    })
}

window.initMap = initMap
