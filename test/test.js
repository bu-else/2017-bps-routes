var chai = require('chai');
var assert = chai.assert;
var path = require('path');
var XLSX = require('xlsx')
var upload = require(path.resolve(__dirname,"../public/scripts/upload.js"));
var excelFiles = require( path.resolve( __dirname, "./excelFiles.js" ));


describe("Basic test", function() {
  it("Runs a test", function() {
    assert.equal(-1, [1,2,3].indexOf(4));
  });
});

describe("Testing that workbookProcessor correctly handles a valid workbook", function() {
  it("Does not throw an error when a valid workbook is uploaded", function() {
    upload.init()
    upload.process(excelFiles.completeInput, function(err, res){
        assert.equal(JSON.stringify(res), JSON.stringify(excelFiles.completeOutput));
      });
    });

});

describe("Testing that workbookProcessor returns error msg when workbook is missing sheets", function() {

  it("Returns Wrong Sheets error when the 'Routes' sheet is missing.", function() {
    upload.process(excelFiles.missingRoutes, function(err, res){
      assert.equal(err, "The workbook must have at least 3 sheets: 'Buses', 'Stop-Assignments' and 'Routes'");
    });
  });

  it("Returns Wrong Sheets error when the 'Stop-Assignments' sheet is missing.", function() {
    upload.process(excelFiles.missingStopAssignments, function(err, res){
      assert.equal(err, "The workbook must have at least 3 sheets: 'Buses', 'Stop-Assignments' and 'Routes'");
    });
  });

  it("Returns Wrong Sheets error when the 'Buses' sheet is missing.", function() {
    upload.process(excelFiles.missingStopAssignments, function(err, res){
      assert.equal(err, "The workbook must have at least 3 sheets: 'Buses', 'Stop-Assignments' and 'Routes'");
    });
  });

});

describe("Testing that worbookProcessor returns error message when a sheet is missing a column", function (){
  it("Returns appropriate error message when Routes is missing a column", function() {
    errs = [];
    upload.process(excelFiles.missingWaypointLat, function(err, res){
      errs.push(err);
    });
    assert.include(errs,"Routes must include the following columns: 'Waypoint Longitude' and 'Waypoint Latitude'");
  });

  it("Returns appropriate error message when Stop-Assignments is missing a column", function (){
    errs = [];
    upload.process(excelFiles.missingPickupType, function(err, res){
      errs.push(err);
    });
    assert.include(errs,"Stop-Assignments must include the following columns: Student Longitude, Student Latitude, Pickup Type, Maximum Walk Distance, School Longitude, School Latitude, Bus ID, Stop Longitude, Stop Latitude");
  });

  it("Returns appropriate error message when Buses is missing a column", function (){
    errs = [];
    upload.process(excelFiles.missingBusID, function(err, res){
      errs.push(err);
    });
    assert.include(errs,"Buses must include the following columns: Bus Capacity, Bus ID, Bus Longitude, Bus Latitude, Bus Type, Bus Yard, Bus Yard Address");
  });

});

