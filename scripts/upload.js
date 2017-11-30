/*jshint browser:true */
/* eslint-env browser */
/* eslint no-use-before-define:0 */
/*global Uint8Array, Uint16Array, ArrayBuffer */
/*global XLSX */

var X = XLSX;
var spinner  = new Spinner(opts);

var global_wb;

var process_wb = (function () {
    var OUT = document.getElementById('out');
    var HTMLOUT = document.getElementById('htmlout');

    var get_format = (function () {
        var radios = document.getElementsByName("format");
        return function () {
            for (var i = 0; i < radios.length; ++i)
                if (radios[i].checked || radios.length === 1)
                    return radios[i].value;
                };
    })();

    /*
	Converts each sheet in a workbook into a json.
	Can access sheets by result.Routes, result.Stop-Assignments, Result.Buses
	*/
    var to_json = function to_json(workbook) {
        // This is an object, not a list
        var result = {};
        workbook
            .SheetNames
            .forEach(function (sheetName) {
                // https://github.com/SheetJS/js-xlsx/issues/169
                var roa = X
                    .utils
                    .sheet_to_json(workbook.Sheets[sheetName], {raw: true});
                if (roa.length)
                    result[sheetName] = roa;
                    //HTMLOUT.innerHTML += JSON.stringify(result,2,2)
                }
            );
        console.log(result["Stop-Assignments"])

        /*
			Group each entry in result.Routes by Bus ID
			Then make lists of longitude and latitudes
			for each Bus
			groupBy is modified from https://stackoverflow.com/questions/38575721/grouping-json-by-values
		*/

        var groupBy = function (xs, key) {
            return xs.reduce(function (rv, x) {
                var lst = (rv[x[key]] = rv[x[key]] || [])
                // lst.push(x["Waypoint Longitude"]); lst.push(x["Waypoint Latitude"]);
                lst.push([x["Waypoint Longitude"], x["Waypoint Latitude"]]);

                return rv;
            }, {});
        };
		console.log(result.StopAssignments);
        var groupedByBus = groupBy(result.Routes, 'Bus ID');
        // console.log(groupedByBus); for (var key in groupedByBus){ 	longitudes = [];
        // 	latitudes = []; 	for (var i = 0; i < (groupedByBus[key]).length; i++){ 		if
        // (i % 2 == 0){ 			longitudes.push(groupedByBus[key][i]); 		} 		else{
        // 			latitudes.push(groupedByBus[key][i]); 		} 	} 	groupedByBus[key] =
        // {"longitudes": longitudes, "latitudes": latitudes}; }
        // console.log(JSON.stringify(groupedByBus,2,2));
				spinner.stop()
        return "Finished grouping Routes sheet by bus";
    };

    var to_csv = function to_csv(workbook) {
        var result = [];
        workbook
            .SheetNames
            .forEach(function (sheetName) {
                var csv = X
                    .utils
                    .sheet_to_csv(workbook.Sheets[sheetName]);
                if (csv.length) {
                    result.push("SHEET: " + sheetName);
                    result.push("");
                    result.push(csv);
                }
            });
        return result.join("\n");
    };

    var to_html = function to_html(workbook) {
        HTMLOUT.innerHTML = "";
        workbook
            .SheetNames
            .forEach(function (sheetName) {
                var htmlstr = X.write(workbook, {
                    sheet: sheetName,
                    type: 'binary',
                    bookType: 'html'
                });
                HTMLOUT.innerHTML += htmlstr;
            });
        return "";
    };

    /*
	Where to_json is called from
	*/
    return function process_wb(wb) {
        global_wb = wb;
        var output = "";
        output = to_json(wb);
        if (OUT.innerText === undefined)
            OUT.textContent = output;
        else
            OUT.innerText = output;
        if (typeof console !== 'undefined')
            console.log("output", new Date());
        };
})();

var setfmt = window.setfmt = function setfmt() {
    if (global_wb)
        process_wb(global_wb);
    };

var do_file = (function () {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;

    return function do_file(files) {
        // We need to check whether a file is there first before running this function.
        // We should have a submit button rather than keep checking whether there is a
        // file read into the form.
        var f = files[0];
        var reader = new FileReader();
				var target = document.getElementById('spin_box')
				spinner.spin(target);
        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS)
                data = new Uint8Array(data);
            else
                process_wb(X.read(data, {
                    type: rABS
                        ? 'binary'
                        : 'array'
                }));
            }
        ;
        if (rABS)
            reader.readAsBinaryString(f);
        else
            reader.readAsArrayBuffer(f);
        }
    ;
})();

(function () {
    var drop = document.getElementById('drop');
    if (!drop.addEventListener)
        return;

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
})();

(function () {
    var xlf = document.getElementById('xlf');
    if (!xlf.addEventListener)
        return;
    function handleFile(e) {
        do_file(e.target.files);
    }
    xlf.addEventListener('change', handleFile, false);
})();


//Options for spinner! :)
var opts = {
	lines: 13, // The number of lines to draw
	length: 28, // The length of each line
	width: 14, // The line thickness
	radius: 42, // The radius of the inner circle
	scale: 1, // Scales overall size of the spinner
	corners: 1, // Corner roundness (0..1)
	color: '#000000', // #rgb or #rrggbb or array of colors
	opacity: 0.25, // Opacity of the lines
	rotate: 0, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	className: 'spinner', // The CSS class to assign to the spinner
	top: '50%', // Top position relative to parent
	left: '50%', // Left position relative to parent
	shadow: false, // Whether to render a shadow
	position: 'relative' // Element positioning
};
