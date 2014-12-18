var worldTour = function(){

  var width = 960,
      height = 500;

  var origin = {x: 0, y: 0};

  var projection = d3.geo.orthographic()
      .scale(248)
      .clipAngle(90);

  d3.select(".worldTourViz").select("*").remove();
  var canvas = d3.select(".worldTourViz").append("canvas")
      .attr("width", width)
      .attr("height", height);

  var c = canvas.node().getContext("2d");

  var path = d3.geo.path()
      .projection(projection)
      .context(c);

  var title = d3.select(".countryName");

  queue()
      .defer(d3.json, "js/viz/worldtour/world-110m.json")
      .defer(d3.tsv, "js/viz/worldtour/ria-country-names.tsv")
      .await(ready);

  function ready(error, world, names) {
    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,
        n;

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    n = countries.length;

    (function transition() {
      if(i < n - 1){
        d3.transition()
            .duration(300)
            .each("start", function() {
                title.text(countries[i = (i + 1)].name);
            })
            .tween("rotate", function() {
              var p = d3.geo.centroid(countries[i]),
                  r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
              return function(t) {
                projection.rotate(r(t));
                c.clearRect(0, 0, width, height);
                c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
                for(var j = 0; j <= i; j++) c.fillStyle = "#f49423", c.beginPath(), path(countries[j]), c.fill();
                c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
              };
            })
          .transition()
            .each("end", transition);
      } else {
        title.text("");
      }
    })();
  }
}
