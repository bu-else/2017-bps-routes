var routeMap = {
    init: function() {
        this.initializeMap()
    },
    initializeMap: function() {
        this.map = L.map('mapid').setView([42.3601, -71.0589], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
        }).addTo(this.map)
    },
    _displayBusRoute: function(latlongs, id, color) {
        var polyline = L.polyline(latlongs, {
            color: color,
            weight: 5,
            smoothFactor: 1,
        }).addTo(this.map).bindPopup(id).openPopup();
        this.map.fitBounds(polyline.getBounds())
    },
    displayBusRoutes: function(latlongsByBus) {
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
            this._displayBusRoute(latlongsByBus[id], id, colors[colorIndex++])
        }
    }
}