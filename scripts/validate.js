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

// Feed me raw data from Stop-Assignments and Routes
function everyStopIncluded(SAdata, Rdata) {
    var stops = {};
    for (var i = 0; i < SAdata.length; i++) {
        var cur = SAdata[i];
        if (!('Stop Longitude') in cur || !('Stop Latitude') in cur) {
            throw new Error('Every student must have a stop assigned');
        }
        stops[cur['Stop Latitude'].toString() + "&" + cur['Stop Longitude'].toString()] = false;
    }

    for (i = 0; i < Rdata.length; i++) {
        var cur = Rdata[i];
        var serialized = cur['Waypoint Longitude'].toString() + "&" + cur['Waypoint Latitude'].toString();
        if (serialized in stops) {
            stops[serialized] = true;
        }
    }

    for (var coords in stops) {
        if (!stops.hasOwnProperty(coords) || stops[coords] === false) {
            return false;
        }
    }
    return true;
}

// Feed me routes and stop assignments
function evaluate(routes, stopAssignments) {
    var buses = {};
    for (var i = 0; i < routes.length; i++) {
        var cur = routes[i];
        var id = cur['Bus ID'];
        if (id in buses) {
            buses.id.push(cur['Waypoint Longitude'].toString() + "&" + cur['Waypoint Latitude'].toString());
        } else {
            buses.id = [];
        }
    }
    var travelTimes = [];
    for (i = 0; i < stopAssignments.length; i++) {
        var cur = stopAssignments[i];
        var start = cur['Student Longitude'].toString() + "&" + cur['Student Latitude'].toString();
        var end = cur['Stop Latitude'].toString() + "&" + cur['Stop Longitude'].toString();
        var id = cur['Bus ID'];
        if (!(id in buses)) {
            throw new Error("Bus " + id + " does not exist");
        }
        var route = buses.id;
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
    return {
        average: avg,
        max: max,
    }
}