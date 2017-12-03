var utils = {
    serDes: {
        decimalPoints: 6,
        serialize: function(lat, long) {
            var sliceAfter = utils.serDes.decimalPoints + 1
            return lat.slice(0, lat.indexOf(".") + sliceAfter) + "&" + long.slice(0, long.indexOf(".") + sliceAfter)
        },
        deserialize: function(latlong) {
            return latlong.split("&").map(function(coord) {
                return parseFloat(coord)
            })
        }
    }
}