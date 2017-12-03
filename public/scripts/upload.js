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

function process_wb(wb) {
    var OUT = document.getElementById('out');
	var HTMLOUT = document.getElementById('htmlout');

    var _process = {
        get_format: function() {
            var radios = document.getElementsByName( "format" );
            for(var i = 0; i < radios.length; ++i) if(radios[i].checked || radios.length === 1) return radios[i].value;
        },
        formats: {
            to_json: function(workbook) {
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    if(roa.length) result[sheetName] = roa;
                });
        
                /*
                    Group each entry in result.Routes by Bus ID
                    Then make lists of longitude and latitudes
                    for each Bus
        
                    groupBy is modified from https://stackoverflow.com/questions/38575721/grouping-json-by-values
                */
        
                var groupBy = function(xs, key) {
                        return xs.reduce(function(rv, x) {
                            var lst = (rv[x[key]] = rv[x[key]] || [])
                            lst.push(x["Waypoint Longitude"]);
                            lst.push(x["Waypoint Latitude"]);
                            return rv;
                        }, {});
                    };
        
                var groupedByBus=groupBy(result.Routes, 'Bus ID');
                //console.log(groupedByBus);
        
                for (var key in groupedByBus){
                    longitudes = [];
                    latitudes = [];
                    for (var i = 0; i < (groupedByBus[key]).length; i++){
                        if (i % 2 == 0){
                            longitudes.push(groupedByBus[key][i]);
                        }
                        else{
                            latitudes.push(groupedByBus[key][i]);
                        }
                    }
                    groupedByBus[key] = {"longitudes": longitudes, "latitudes": latitudes};
        
                }
        
                //console.log(JSON.stringify(groupedByBus,2,2));
                spinner.stop()
                return (JSON.stringify(groupedByBus,2,2));
            },
            to_csv: function(workbook) {
                var result = [];
                workbook.SheetNames.forEach(function(sheetName) {
                    var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                    if(csv.length){
                        result.push("SHEET: " + sheetName);
                        result.push("");
                        result.push(csv);
                    }
                });
                return result.join("\n");
            },
            to_html: function(workbook) {
                HTMLOUT.innerHTML = "";
                workbook.SheetNames.forEach(function(sheetName) {
                    var htmlstr = X.write(workbook, {sheet:sheetName, type:'binary', bookType:'html'});
                    HTMLOUT.innerHTML += htmlstr;
                });
                return "";
            }
        }
    }
    
    global_wb = wb;
    var output = "";
    switch(_process.get_format()) {
        case "form": output = _process.formats.to_fmla(wb); break;
        case "html": output = _process.formats.to_html(wb); break;
        case "json": output = _process.formats.to_json(wb); break;
        default: output = _process.formats.to_csv(wb);
    }
    if(OUT.innerText === undefined) OUT.textContent = output;
    else OUT.innerText = output;
    if(typeof console !== 'undefined') console.log("output", new Date());
}

var setfmt = window.setfmt = function setfmt() { if(global_wb) process_wb(global_wb); };

function do_file(files) {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if(!rABS) domrabs.disabled = !(domrabs.checked = false);
    
    console.log(files[0])
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

window.onload = function() {
    var submit = {
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
    submit.init()
};

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36810333-1']);
_gaq.push(['_trackPageview']);