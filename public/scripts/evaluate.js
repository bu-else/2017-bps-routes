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
	let lat1 = begin[1];
	let lat2 = end[1];
	let lon1 = begin[0];
	let lon2 = end[0];
	let R = 6371e3; // metres
	let φ1 = toRadians(lat1);
	let φ2 = toRadians(lat2);
	let Δφ = toRadians(lat2 - lat1);
	let Δλ = toRadians(lon2 - lon1);
	let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c;
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
	let rr = {};
	for (let r in routes) {
		rr[r] = routeDistance(routes[r]);
	}
	return rr;
}

function main() {
	testJson = {
		"B286": [
			["a", "b"],
			["a", "b"]
		],
		"B287": [
			["a", "b"],
			["a", "b"]
		]
	};
	console.log(`Number of Buses: ${numberOfBuses(testJson)}`);
	console.log(`Distance: ${distance([0, 0], [45, 45])}`);
	console.log(`Route distance: ${routeDistance([[0,0], [30,30], [60,60], [90,90]])}`);
	console.log(`Routes distances: ${JSON.stringify(routesDistance({"a": [[0, 0], [90, 90]], "b": [[0,0], [30,30], [60,60], [90,90]], "c": [[0, 0],[45,45], [90, 90]] }))}`);
}
main();