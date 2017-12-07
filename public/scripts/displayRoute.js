// make map variable global for later use
var map;

var routeMap = {
    init: function() {
        this.initializeMap();
    },
    initializeMap: function() {
        map = L.map('mapid').setView([42.3601, -71.0589], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            // Make sure you remove the accessToken before you commit!!!!!!!!!!!
            accessToken: '<PUT YOUR ACCESS TOKEN HERE>'
        }).addTo(map);
    }
}

function _displayBusRoute(latlongs, color) {
    var deserializedLatLongs = latlongs.map(function(coords) {
        return utils.serDes.deserialize(coords)
    })
    var polyline = L.polyline(deserializedLatLongs, {
        color: color,
        weight: 5,
        smoothFactor: 1,
    }).addTo(map)
    map.fitBounds(polyline.getBounds())
}

function displayBusRoutes(latlongsByBus) {
    // Count how many buses there are. This is used to generate random colors
    var count = 0;
    for (var k in latlongsByBus) {
        if (latlongsByBus.hasOwnProperty(k)) {
           ++count
        }
    }

    var rColorConfig = {
        luminosity: 'bright',
        seed: 123456789,
        count: count,
    }
    var colors = randomColor(rColorConfig)
    var colorIndex = 0
    for (var id in latlongsByBus) {
        _displayBusRoute(latlongsByBus[id], colors[colorIndex++])
    }
}
