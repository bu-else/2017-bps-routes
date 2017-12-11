var chai = require('chai');
var assert = chai.assert;
var path = require('path');
var XLSX = require('xlsx')
var upload = require(path.resolve(__dirname,"../public/scripts/upload.js"));
var excelFiles = require( path.resolve( __dirname, "./excelFiles.js" ));

console.log(Object.keys(upload));


let buses_headers = ["Bus Capacity", "Bus ID", "Bus Longitude", "Bus Latitude", "Bus Type", "Bus Yard", "Bus Yard Address"];
let stops_headers = ["Student Longitude", "Student Latitude", "Pickup Type", "Maximum Walk Distance", "School Longitude", "School Latitude", "Bus ID", "Stop Longitude", "Stop Latitude"]
let routes_headers = ["Bus ID", "Waypoint Longitude", "Waypoint Latitude"]



describe('Basic test', function() {
  it('Runs a test', function() {
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});

describe('Import Test', function() {
  it('Runs an imported function', function() {
    assert.equal("", upload._process(excelFiles.goodExcel))
  })
})

//
// describe('Testing that valid excel files pass', function() {
//   it('does stuff', function() {
//     assert.equal(upload._to_json(good_excel), "excelFiles.good_excel")
//   })
// })
