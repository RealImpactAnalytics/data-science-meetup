var fullMixModel = function(){

  var width = 960,
      height = 500,
      strokeWidth = 3;

  var nodeNum = 70;

  var radius = (height/2);

  var force = d3.layout.force()
    .gravity(0.02)
    .charge(-10)
    .size([width, height]);

  d3.select(".fullMixModelViz").selectAll("*").remove();
  var svg = d3.select(".fullMixModelViz").append("svg")
      .attr("width", width)
      .attr("height", height);

  var circle = svg.append("g").selectAll("circle")
    .data([1])
    .enter()
    .append("circle")
      .attr("r", radius-strokeWidth)
      .style("fill", "#fff")
      .style("stroke", "#000")
      .style("stroke-width", strokeWidth)
      .attr("cx", width/2)
      .attr("cy", height/2);

  var nodes = d3.range(1, nodeNum).map(function(d){return {index: d, x: width*Math.random(), y: height*Math.random()};});

  force.nodes(nodes);
  force.start();

  var nodesCircle = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    //.style("fill", function(d) { return color(d.group); })
    .attr("r", 10)
    .style("fill", "#D0D0D0")
    .style("strokeWidth", 2)
    .style("stroke", "gray")
    .call(force.drag);

  force.on("tick", function() {
    svg.selectAll(".node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });

  var offset = 0;
  var set = 1;
  var infection = setInterval(function () {
    svg.selectAll(".node")
    .transition()
      .duration(500)
      .ease("bounce")
      .style("fill", function(d) {
        if(d.index < offset+set){
          color = "#d9534f";
        } else {
          color = "#D0D0D0";
        }
        return color; });
    offset += set;
    set *= 2;

    if(offset > nodeNum) {window.clearInterval(infection);}
  }, 2000);

};
