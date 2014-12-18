var hybridModel = function(){

  var width = 960,
      height = 500;

  d3.select(".hybridModelViz").selectAll("*").remove();

  var svg = d3.select(".hybridModelViz")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  var nodes = [],
      foci = [{x: width/3, y: 2*height/3}, {x: width/2, y: height/3}, {x: 2*width/3, y: 2*height/3}],
      fociPushed = [{x: (width/3)-10, y: (2*height/3)+10}, {x: (width/2), y: (height/3)-20}, {x: (2*width/3)+10, y: (2*height/3)+10}];

  var localities = svg.append("g").selectAll("locality")
        .data(fociPushed)
        .enter().append("circle")
            .attr("class", "locality")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", 100)
            .style("fill", "#fff")
            .style("stroke", "#000")
            .style("stroke-width", 3);

  nodes = _.map(d3.range(1, 60), function(){
    return {id: ~~(Math.random() * foci.length),
            infected: false};
  });

  var force = d3.layout.force()
      .nodes(nodes)
      .links([])
      .gravity(0)
      .size([width, height])
      .on("tick", tick);

  var node = svg.selectAll(".node");

  node = node.data(nodes);

  node.enter().append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 8)
      .style("fill", function(d) { return "#D0D0D0"; })
      .style("stroke", function(d) { return "gray"; })
      .call(force.drag);

  force.start();

  function tick(e) {
    var k = 0.1 * e.alpha;

    // Push nodes toward their designated focus.
    nodes.forEach(function(o, i) {
      o.y += (foci[o.id].y - o.y) * k;
      o.x += (foci[o.id].x - o.x) * k;
    });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  var movementInterval = setInterval(function(){
    var index = ~~(Math.random() * nodes.length);

    nodes.forEach(function(n, i) {
      if(index == i){
        n.id = ~~(Math.random() * foci.length);
      }
    });

    force.start();
  }, 500);

  nodes[0].infected = true;
  svg.selectAll(".node")
    .filter(function(d) { return d.index===0; })
    .transition()
      .duration(500)
      .ease("bounce")
    .attr("r",9)
    .style("fill", "#d9534f");

  var infectedInterval = setInterval(function(){
    var count = _.countBy(nodes, function(node) {
      return node.id;
    });
    var countInfected = _.countBy(nodes, function(node) {
      if(node.infected === true ){
        return node.id;
      }
      else{
        return -1;
      }
    });

    var infectiousRates = [
      countInfected[0] !== undefined ? countInfected[0]/count[0] : 0,
      countInfected[1] !== undefined ? countInfected[1]/count[1] : 0,
      countInfected[2] !== undefined ? countInfected[2]/count[2] : 0];

    svg.selectAll(".node")
      .filter(function(d) {
        var toInfect = !d.infected && infectiousRates[d.id] > Math.random();
        if(toInfect){ d.infected = true;}
        return toInfect; })
      .transition()
        .duration(500)
        .ease("bounce")
      .attr("r",9)
      .style("fill", "#d9534f");

    var nonInfected = _.filter(nodes, function(n){return !n.infected;});
    if(nonInfected.length === 0) {
      window.clearInterval(infectedInterval);
      window.clearInterval(movementInterval);
    }

  }, 1000);
};
