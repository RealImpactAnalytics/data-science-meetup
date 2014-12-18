var worldRatio = function(){

  var width = 960,
      height = 500,
      strokeWidth = 3;

  var ratio = 0.041,
      radius = (height/2),
      h = computeheight(ratio, radius);

  //var ratioDisplay = d3.select(".ratio");
  var ratioFormat = d3.format(",.0%");

  d3.select(".worldRatioViz").selectAll("*").remove();
  var worldRatioSvg = d3.select(".worldRatioViz").append("svg")
      .attr("width", width)
      .attr("height", height);

  var circle = worldRatioSvg.selectAll("circle")
    .data([1])
    .enter()
    .append("circle")
      .attr("r", radius-strokeWidth)
      .style("fill", "#f49423")
      .style("stroke", "#000")
      .style("stroke-width", strokeWidth)
      .attr("cx", width/2)
      .attr("cy", height/2);

  // clip path for the brown circle
  var clip = worldRatioSvg.append("clipPath")
      // make an id unique to this node
      .attr('id', "clip")
    // use the rectangle to specify the clip path itself
    .append('rect')
      .attr("x", 0)
      .attr("width", width)
      .attr("y", 0)
      .attr("height", 0);

  // brown circle
  worldRatioSvg.append("circle")
      // clip with the node-specific clip path
      .attr("clip-path", "url(#clip)")
      .attr("r", radius-strokeWidth)
      .style("fill", "#fff")
      .style("stroke", "#000")
      .style("stroke-width", strokeWidth)
      .attr("cx", width/2)
      .attr("cy", height/2);

  var ratioDisplay = worldRatioSvg.append("text")
    .attr("x", width/2)
    .attr("y", height / 2)
    .attr("class", "simulh2")
    .style("text-anchor", "middle");

  clip.transition()
    .delay(500)
    .duration(2000)
    .ease("bounce")/*function(t){
      ratioDisplay.text(ratioFormat(((1-t)*(1-ratio)) + ratio))
      return t;
    })*/
    .attr("height", height-h);

  function computeheight(k, radius) {
    var t0, t1 = k * 2 * Math.PI;
    if (k > 0 && k < 1) {
      t1 = Math.pow(12 * k * Math.PI, 1 / 3);
      for (var i = 0; i < 10; ++i) {
        t0 = t1;
        t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
      }
      k = (1 - Math.cos(t1 / 2)) / 2;
    }
    return k * radius * 2;
  }
}
