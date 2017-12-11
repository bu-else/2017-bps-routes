/**
 * Evaluation script for BPS-Bus
 *
 * Evaluations:
 * 1) Total number of buses used
 * 2) Total distance buses travelled
 *
 */
/**
 * Calculate number of buses by counting the number of unique bus ids.
 *
 * @param routes: json parsed from the Routes worksheet.
 */
function numberOfBuses(routes) {
	return Object.keys(routes).length;
}
/**
 * Convert degree to radian
 * 
 * @param {*} degree 
 */
function toRadians(degree) {
	return degree * Math.PI / 180;
}
/**
 * Distance between two point.
 * Accept point as tuple of (long, lat).
 * 
 * Code from here: https://www.movable-type.co.uk/scripts/latlong.html
 * 
 * @param {*} begin 
 * @param {*} end 
 * @returns {number} distance in meters
 */
function distance(begin, end) {
	var lat1 = begin[1];
	var lat2 = end[1];
	var lon1 = begin[0];
	var lon2 = end[0];
	var R = 6371e3; // metres
	var φ1 = toRadians(lat1);
	var φ2 = toRadians(lat2);
	var Δφ = toRadians(lat2 - lat1);
	var Δλ = toRadians(lon2 - lon1);
	var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
}
/**
 * Calculate distance for one route.
 * 
 * @param {*} routes Array of (long, lat) tuples
 */
function routeDistance(route) {
	return route.reduce((acc, curVal, curIx, arr) => {
        // This probably not a best usage of reduce now that I think about it :D
        if (arr.length === 2) {
            return distance(arr[0], arr[1]);
        } else if (curIx === arr.length - 1) {
			// If we are looking at the last element of the array, 
			// we don't have any place to move, thus the distance is 0.
			return acc;
		} else if (curIx === 1) {
			return distance(acc, curVal) + distance(curVal, arr[curIx + 1]);
		} else {
			// Otherwise, we calculate the distance 
			// between the current and the next place we go and add it to the acc.
			return acc + distance(curVal, arr[curIx + 1]);
		}
	});
}
/**
 * Calculate route distances on a dictionary of routes.
 * 
 * @param {*} routes 
 */
function routesDistance(routes) {
	var rr = {};
	for (var r in routes) {
		rr[r] = routeDistance(routes[r]);
	}
	return rr;
}

function distanceTraveledByStudent(routes, stopAssignments) {
    return new Promise(function(resolve, reject) {
        var result = []
        for (var i = 0; i < stopAssignments.length; i++) {
            var student = stopAssignments[i]
            if (!routes.hasOwnProperty(student['Bus ID'])) {
                reject('Bus with ID of ' + student['Bus ID'] + ' not found in routes')
            }
            var route = routes[student['Bus ID']]
            var serializedPickUp = utils.serDes.serialize(student['Stop Latitude'], student['Stop Longitude'])
            var serializedSchool = utils.serDes.serialize(student['School Latitude'], student['School Longitude'])
            var start = end = -1
            for (var j = 1; j < route.length; j++) {
                if (start === -1 && route[j] === serializedPickUp) {
                    start = j
                } 
                else if (start !== -1 && end === -1 && route[j] === serializedSchool) {
                    end = j
                    break
                }
            }
            if (start === end) {
                reject('Something terrible has happened...')
            }
            result.push(end - start)
        }
        resolve(result)
    })
}