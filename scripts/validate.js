/*
* Functions to validate that the excel sheet is of the right format before it is evaluated
*/

// feed me raw data from Stop-Assignments
function studentAssignment(data) {
    for (var i = 0; i < data.length; i++) {
        if (!('Student Latitude') in data[i] || 
        !('Student Longitude') in data[i] || 
        !('Stop Latitude') in data[i] || 
        !('Stop Longitude') in data[i]) {
            return false;
        }
    }
    return true;
}

function serialize(lat, long) {
    var decimalPoints = 4
    var sliceAfter = decimalPoints + 1
    return lat.slice(0, lat.indexOf(".") + sliceAfter) + "&" + long.slice(0, long.indexOf(".") + sliceAfter)
}

// Feed me raw data from Stop-Assignments and Routes
function everyStopIncluded(SAdata, Rdata) {
    var stops = {}
    for (var i = 0; i < SAdata.length; i++) {
        var cur = SAdata[i]
        if (!('Stop Longitude') in cur || !('Stop Latitude') in cur) {
            return false
        }
        var lat = cur['Stop Latitude'].toString()
        var long = cur['Stop Longitude'].toString()
        stops[serialize(lat, long)] = false;
    }

    for (i = 0; i < Rdata.length; i++) {
        var cur = Rdata[i]
        var lat = cur['Waypoint Latitude'].toString()
        var long = cur['Waypoint Longitude'].toString()
        var serialized = serialize(lat, long);
        if (serialized in stops) {
            stops[serialized] = true;
        }
    }
    console.log(stops)

    for (var coords in stops) {
        if (!stops.hasOwnProperty(coords) || stops[coords] === false) {
            console.log(coords)
            return false;
        }
    }
    return true;
}

/**
 * Bus capacity validation.
 * 
 * Check how much student get assigned to a bus and 
 * yell if the bus carries more than it can.
 * 
 * @param {*} studentAssignment 
 */
function busCapacity(studentAssignment){
    
}

// Feed me routes and stop assignments
function evaluate(routes, stopAssignments) {
    var buses = {};
    for (var i = 0; i < routes.length; i++) {
        var cur = routes[i];
        var id = cur['Bus ID'];
        if (id in buses) {
            var lat = cur['Waypoint Latitude'].toString()
            var long = cur['Waypoint Longitude'].toString()
            buses[id].push(serialize(lat, long));
        } else {
            buses[id] = [];
        }
    }

    var travelTimes = [];
    for (i = 0; i < stopAssignments.length; i++) {
        var cur = stopAssignments[i];
        var start = serialize(cur['Student Latitude'].toString(), cur['Student Longitude'].toString());
        var end = serialize(cur['Stop Latitude'].toString(), cur['Stop Longitude'].toString());
        var id = cur['Bus ID'];
        if (!(id in buses)) {
            return false;
        }
        var route = buses[id];
        console.log(route.length)
        var startIndex = endIndex = -1;
        for (var j = 0; j < route.length; j++) {
            if (route[j] === start && startIndex === -1) {
                startIndex = j;
            }
            if (route[j] === end && startIndex !== -1 && endIndex === -1) {
                endIndex = j;
            }
        }
        travelTimes.push(endIndex - startIndex);
    }

    // Calculate average and max travel time
    var sum = 0;
    var max = 0;
    for (i = 0; i < travelTimes.length; i++) {
        if (travelTimes[i] > max) max = travelTimes[i];
        sum += travelTimes[i];
    }
    var avg = sum / travelTimes.length;
    console.log(travelTimes)
    return {
        average: avg,
        max: max,
    }
}

function runEvaluation(routes, stopAssignments) {
    if (studentAssignment(stopAssignments) && everyStopIncluded(stopAssignments, routes)) {
        return evaluate(routes, stopAssignments)
    }
}