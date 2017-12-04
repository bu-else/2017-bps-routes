/**
 * Tool to convert a Excel .xlsx spreadsheet to .json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const ARGV = process
    .argv
    .slice(2);

function parseFile(path, transformer) {
    // This only work on Node.js
    let workbook = XLSX.readFile(path);

    workbook
        .SheetNames
        .map((v, ix) => {
            console.log(`Got sheet ${v}.`);
            let sheetJson = XLSX
                .utils
                .sheet_to_json(workbook.Sheets[v]);
            fs.writeFile(`${path}.${v}.json`, JSON.stringify(transformer(sheetJson, v)), (err) => {
                return console.log(err);
            });
            console.log(`Wrote file ${path}.${v}.json`);
        });

}

function main() {
    if (ARGV.length > 0) {
        let inputFile = ARGV[0];

        function groupByBus (sheet,sheetName) {
            if (sheetName == "Sheet1"){
                return groupBy(sheet, 'Bus ID');
            }

        }

        parseFile(inputFile, groupByBus);
    }
}

/**
 * Group each entry in result.Routes by Bus ID
 * Then make lists of longitude and latitudes
 * for each Bus 
 * 
 * groupBy is modified from https://stackoverflow.com/questions/38575721/grouping-json-by-values 
 * 
*/

function groupBy (xs, key) {
    return xs.reduce(function (rv, x) {
        let lst = (rv[x[key]] = rv[x[key]] || [])
        // lst.push(x["Waypoint Longitude"]); lst.push(x["Waypoint Latitude"]);
        lst.push([x["Waypoint Longitude"], x["Waypoint Latitude"]]);

        return rv;
    }, {});
}

main();