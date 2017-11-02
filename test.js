var chai = require('chai');
var assert = chai.assert;
var formatJSON = require('./scripts/formatJSON.js')



describe('Basic test', function() {
  it('Runs a test', function() {
    var arr = [];
    assert.equal(arr.length, 0);
  });
});

describe('Reformat JSON', function(){
  it('Groups coordinates by bus', function(){
    var testJSON = [{"Bus ID":"HS118","Waypoint Longitude":"-71.02697639","Waypoint Latitude":"42.38006001"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02733273","Waypoint Latitude":"42.37996816"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02760805","Waypoint Latitude":"42.38039599"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02771994","Waypoint Latitude":"42.38055973"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02774876","Waypoint Latitude":"42.38060375"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02801809","Waypoint Latitude":"42.38050264"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02860961","Waypoint Latitude":"42.38028211"},{"Bus ID":"HS118","Waypoint Longitude":"-71.02874322","Waypoint Latitude":"42.38023257"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03023342","Waypoint Latitude":"42.37967202"},{"Bus ID":"HS118","Waypoint Longitude":"-71.0306496","Waypoint Latitude":"42.38029045"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03278772","Waypoint Latitude":"42.37947867"},{"Bus ID":"HS120","Waypoint Longitude":"-71.034367","Waypoint Latitude":"42.37889762"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03536348","Waypoint Latitude":"42.37929153"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03577697","Waypoint Latitude":"42.37990581"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03423378","Waypoint Latitude":"42.38047583"},{"Bus ID":"HS118","Waypoint Longitude":"-71.03410126","Waypoint Latitude":"42.38053429"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05760254","Waypoint Latitude":"42.30676975"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05760182","Waypoint Latitude":"42.30676685"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05759219","Waypoint Latitude":"42.30672359"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05758774","Waypoint Latitude":"42.30669956"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05758375","Waypoint Latitude":"42.30667554"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05757566","Waypoint Latitude":"42.30660965"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05757246","Waypoint Latitude":"42.30657122"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05756996","Waypoint Latitude":"42.30653279"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05756838","Waypoint Latitude":"42.30649368"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05756773","Waypoint Latitude":"42.30645526"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05757377","Waypoint Latitude":"42.30631739"},{"Bus ID":"HS119","Waypoint Longitude":"-71.0575781","Waypoint Latitude":"42.30625978"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05758065","Waypoint Latitude":"42.30622549"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05758961","Waypoint Latitude":"42.30613428"},{"Bus ID":"HS119","Waypoint Longitude":"-71.05760557","Waypoint Latitude":"42.30596764"}]

    var groupedJSON = {"HS118":["-71.02697639","42.38006001","-71.02733273","42.37996816","-71.02760805","42.38039599","-71.02771994","42.38055973","-71.02774876","42.38060375","-71.02801809","42.38050264","-71.02860961","42.38028211","-71.02874322","42.38023257","-71.03023342","42.37967202","-71.0306496","42.38029045","-71.03278772","42.37947867","-71.03536348","42.37929153","-71.03577697","42.37990581","-71.03423378","42.38047583","-71.03410126","42.38053429"],"HS120":["-71.034367","42.37889762"],"HS119":["-71.05760254","42.30676975","-71.05760182","42.30676685","-71.05759219","42.30672359","-71.05758774","42.30669956","-71.05758375","42.30667554","-71.05757566","42.30660965","-71.05757246","42.30657122","-71.05756996","42.30653279","-71.05756838","42.30649368","-71.05756773","42.30645526","-71.05757377","42.30631739","-71.0575781","42.30625978","-71.05758065","42.30622549","-71.05758961","42.30613428","-71.05760557","42.30596764"]};

    assert.deepEqual(formatJSON.groupBy(testJSON, 'Bus ID'),groupedJSON);
  });
});
