/*jshint browser:true */
/* eslint-env browser */
/* eslint no-use-before-define:0 */
/*global Uint8Array, Uint16Array, ArrayBuffer */
/*global XLSX */

var X = XLSX;
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
var spinner  = new Spinner(opts);
var target = document.getElementById('spin_box')

function process_wb(wb) {
  var OUT = document.getElementById('out');
	var HTMLOUT = document.getElementById('htmlout');
  spinner.spin(target);



  var _to_json = function(workbook){
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      sheetName = sheetName.trim()

        if (sheetName != 'Buses' && sheetName != 'Stop-Assignments' && sheetName != 'Routes'){
          spinner.stop();
          alert('Workbook must contain 3 sheets called Buses, Stop-Assignments, and Routes. Please check your submission and try again.')
          throw new Error('InvalidExcelFile');
        }

        var headers = get_header_row(workbook.Sheets[sheetName])

        let buses_headers = ["Bus Capacity", "Bus ID", "Bus Longitude", "Bus Latitude", "Bus Type", "Bus Yard", "Bus Yard Address"];
        let stops_headers = ["Student Longitude", "Student Latitude", "Pickup Type", "Maximum Walk Distance", "School Longitude", "School Latitude", "Bus ID", "Stop Longitude", "Stop Latitude"]
        let routes_headers = ["Bus ID", "Waypoint Longitude", "Waypoint Latitude"]

        if (sheetName == 'Buses'){
          for (var i = 0; i < buses_headers.length; i++){
            var h = buses_headers[i];
            if (headers.indexOf(h.trim()) == -1){
              spinner.stop();
              alert('Buses sheet must contain the following columns: ' + buses_headers.join(", "));
              throw new Error('InvalidExcelFile');
            }
          }
        }
        else if (sheetName == 'Stop-Assignments'){
          for (var i = 0; i < stops_headers.length; i++){
            var h = stops_headers[i];
            if (headers.indexOf(h.trim()) == -1){
              spinner.stop();
              alert('Stop Assignments sheet must contain the following columns: ' + stops_headers.join(", "));
              throw new Error('InvalidExcelFile');
            }
          }
        }
        else{
          for (var i = 0; i < routes_headers.length; i++){
            var h = routes_headers[i];
            if (headers.indexOf(h.trim()) == -1){
              spinner.stop();
              alert('Routes sheet must contain the following columns: ' + routes_headers.join(", "));
              throw new Error('InvalidExcelFile');
        }
      }
    }

    var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if(roa.length) result[sheetName] = roa;
    });

    if (Object.keys(result).length != 3 ){
      spinner.stop();
      alert('Workbook must contain 3 sheets called Buses, Stop-Assignments, and Routes. Please check your submission and try again.')
      throw new Error('InvalidExcelFile');
    }

    var output = {}
    for (var i = 0; i < result.Routes.length; i++) {
        var cur = result.Routes[i]
        if (!(cur['Bus ID'] in output)) {
            output[cur['Bus ID']] = []
        } else {
            output[cur['Bus ID']].push(utils.serDes.serialize(cur['Waypoint Latitude'], cur['Waypoint Longitude']))
        }
    }
    spinner.stop();
    return JSON.stringify(output);
  }

    global_wb = wb;
    var output = _to_json(wb);

    if(OUT.innerText === undefined) OUT.textContent = output;
    else OUT.innerText = output;
    if(typeof console !== 'undefined') console.log("output", new Date());
}

var setfmt = window.setfmt = function setfmt() { if(global_wb) process_wb(global_wb); };

function do_file(files) {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if(!rABS) domrabs.disabled = !(domrabs.checked = false);
    rABS = domrabs.checked;

    var f = files[0];
    var reader = new FileReader();
    var target = document.getElementById('spin_box')
    spinner.spin(target);
    reader.onload = function(e) {
        var data = e.target.result;
        if(!rABS) data = new Uint8Array(data);
        else {
            process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
        }
    };
    if(rABS) reader.readAsBinaryString(f);
    else reader.readAsArrayBuffer(f);
}

var upload = {
    init: function() {
        this._attachDropEventListener();
        this._attachXlfEventListener();
        this._loadGoogleAnalytics();
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
    },
    _loadGoogleAnalytics: function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    }
}

spinner.spin(target);

function get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36810333-1']);
_gaq.push(['_trackPageview']);
