var workbookProcessor = {
    init: function() {
        if (this._initialized) {
            console.log('Workbook Processor is already initialized!')
            return
        }
        if (typeof XLSX === 'undefined') {
            this._initialized = true
            this._XLSX = require('xlsx')
        } else {
            this._initialized = true
            this._XLSX = XLSX
        }
    },
    _initialized: false,
    _bussesHeaders: ["Bus Capacity", "Bus ID", "Bus Longitude", "Bus Latitude", "Bus Type", "Bus Yard", "Bus Yard Address"],
    _stopsHeaders: ["Student Longitude", "Student Latitude", "Pickup Type", "Maximum Walk Distance", "School Longitude", "School Latitude", "Bus ID", "Stop Longitude", "Stop Latitude"],
    _routesHeaders: ["Bus ID", "Waypoint Longitude", "Waypoint Latitude"],
    _getHeaderRow: function(sheet) {
        var headers = [];
        var range = this._XLSX.utils.decode_range(sheet['!ref']);
        var C, R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for(C = range.s.c; C <= range.e.c; ++C) {
            var cell = sheet[this._XLSX.utils.encode_cell({c:C, r:R})]
            var hdr = "UNKNOWN " + C;
            if(cell && cell.t) hdr = this._XLSX.utils.format_cell(cell);

            headers.push(hdr);
        }
        return headers;
    },
    _process : function(workbook, callback) {
        // use workbookProcessor.process(workbook, callback) THIS IS A "PRIVATE" method
        //console.log(JSON.stringify(workbook))
        var that = this // this is needed to preserve reference to workbookProcessor object
        var result = {}

        if (workbook.SheetNames.length < 3 ||
            workbook.SheetNames.indexOf("Buses") == -1 ||
            workbook.SheetNames.indexOf("Stop-Assignments") == -1 ||
            workbook.SheetNames.indexOf("Routes") == -1 ){
                return callback("The workbook must have at least 3 sheets: 'Buses', 'Stop-Assignments' and 'Routes'");
        }
        workbook.SheetNames.forEach(function(sheetName) {
            sheetName = sheetName.trim()
            var headers = that._getHeaderRow(workbook.Sheets[sheetName])
            switch(sheetName) {
                case 'Buses':
                    for (var i = 0; i < that._bussesHeaders.length; i++){
                        var h = that._bussesHeaders[i];
                        if (headers.indexOf(h) == -1) {
                            return callback("Buses must include the following columns: Bus Capacity, Bus ID, Bus Longitude, Bus Latitude, Bus Type, Bus Yard, Bus Yard Address")
                        }
                    }
                    break
                case 'Stop-Assignments':
                    for (var i = 0; i < that._stopsHeaders.length; i++){
                        var h = that._stopsHeaders[i];
                        if (headers.indexOf(h) == -1){
                            return callback("Stop-Assignments must include the following columns: Student Longitude, Student Latitude, Pickup Type, Maximum Walk Distance, School Longitude, School Latitude, Bus ID, Stop Longitude, Stop Latitude")
                        }
                    }
                    break
                case 'Routes':
                    for (var i = 0; i < that._routesHeaders.length; i++){
                        var h = that._routesHeaders[i];
                        if (headers.indexOf(h) == -1){
                            return callback("Routes must include the following columns: 'Waypoint Longitude' and 'Waypoint Latitude'")
                        }
                    }
                    break
                default:
            }
            var sheet = that._XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
            if(sheet) result[sheetName] = sheet;
        })
        //console.log(JSON.stringify(result));
        return callback(null, result)
    },
    process: function(workbook, callback) {

        workbookProcessor._process(workbook, function(err, res) {
            if (err) {
                return callback(err)
            }
            return callback(null, res)
        })
    },
    groupRoutesByBusId: function(routes) {
        var result = {}
        for (var i = 0; i < routes.length; i++) {
            var cur = routes[i]
            var busID = cur['Bus ID']
            var lat = cur['Waypoint Latitude']
            var long = cur['Waypoint Longitude']
            if (result.hasOwnProperty(busID)) {
                result[busID].push([lat, long])
            } else {
                result[busID] = [[lat, long]]
            }
        }
        return result
    }
}

if (typeof window !== 'undefined') {
    // If the running environment is on a browser, attach do_file to the window (makes it a global variable)
    window.do_file = function(files) {
        var f = files[0]
        var reader = new FileReader()
        reader.onload = function(e) {
            var data = e.target.result
            var workbook = XLSX.read(data, {type: 'binary'})
            workbookProcessor.process(workbook, function(err, result) {
                // spinner.stop()
                if (err) {
                    showModal(err)
                } else {
                    window.globalFile = f
                    var routes = workbookProcessor.groupRoutesByBusId(result.Routes)
                    var distances = routesDistance(routes)
                    var sum = 0
                    var max = -1
                    var numBuses = 0
                    for (var busId in distances) {
                        numBuses += 1
                        var distance = distances[busId]
                        if (distance > max) {
                            max = parseFloat(distance)
                        }
                        sum += parseFloat(distance)
                    }
                    var avg = sum / numBuses
                    window.score = {
                        avg: avg,
                        max: max,
                    }
                    var resultText = document.getElementById("result-text")
                    resultText.innerText = "Average Distance Traveled: " + avg.toFixed(2) + "m\nMax Distance Traveled: " + max.toFixed(2) + "m"
                    var flows = document.getElementById("flows")
                    routeMap.displayBusRoutes(routes)
                    flows.classList.add("two")
                }
            })
        }
        reader.readAsBinaryString(f);
    }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = workbookProcessor;
}


function showModal(msg) {
    bootbox.alert({
        message: msg
    })
}
var upload = {
    init: function() {
        this._attachDropEventListener();
        this._attachXlfEventListener();
    },
    _attachDropEventListener: function() {
        var drop = document.getElementById('drop');
        if(!drop.addEventListener) return;

        function handleDrop(e) {
            e.stopPropagation();
            e.preventDefault();
            do_file(e.dataTransfer.files);
        }

        function handleDragover(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }

        drop.addEventListener('dragenter', handleDragover, false);
        drop.addEventListener('dragover', handleDragover, false);
        drop.addEventListener('drop', handleDrop, false);
    },
    _attachXlfEventListener: function() {
        var xlf = document.getElementById('xlf');
        if(!xlf.addEventListener) return;
        function handleFile(e) { do_file(e.target.files); }
        xlf.addEventListener('change', handleFile, false);
    }
}
