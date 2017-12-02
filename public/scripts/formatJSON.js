exports.groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      var lst = (rv[x[key]] = rv[x[key]] || [])
      lst.push(x["Waypoint Longitude"]);
      lst.push(x["Waypoint Latitude"]);
      return rv;
    }, {});
  };
