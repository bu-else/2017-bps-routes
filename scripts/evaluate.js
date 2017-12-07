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
  * :param routes: json parsed from the Routes worksheet.
  */
function numberOfBuses(routes) {
    return Object
        .keys(routes)
        .length;
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

    console.log(numberOfBuses(testJson));
}
