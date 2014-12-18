var mobilityModel = function(){

  var width = 960,
      height = 500,
      strokeWidth = 3;

  var nodeNum = 70;

  var radius = (height/2);

  var force = d3.layout.force()
    .gravity(0.02)
    .charge(-50)
    .linkDistance(50)
    .size([width, height]);

  d3.select(".mobilityModelViz").selectAll("*").remove();
  var svg = d3.select(".mobilityModelViz").append("svg")
      .attr("width", width)
      .attr("height", height);

  var nodes = d3.range(0, nodeNum).map(function(d){return {infected: false, index: d, x: width*Math.random(), y: height*Math.random()};});
  var links = [];
  force.nodes(nodes);
  force.links(links);
  force.start();

  var svgBack = svg.append("g");

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

  var linkLine = svgBack.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 2);

  force.on("tick", function() {
    nodesCircle
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

    svgBack.selectAll(".link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  });

  var offset = 0;
  var set = 1;
  var queue = [0];
  var pointer = 1;
  var connect = setInterval(function () {
    var nodes = force.nodes();
    var neighborgsNum = Math.floor(Math.random() * 5) + 1;
    var neighborgsIndices = d3.range(pointer, Math.min(nodeNum, pointer+neighborgsNum));
    var currentNode = queue.shift();
    queue = queue.concat(neighborgsIndices);

    neighborgsIndices.map(function(d){
      links.push({source: nodes[currentNode], target: nodes[d]});
      update();
      return {source: nodes[currentNode], target: nodes[d]};
    });

    pointer += neighborgsNum;

    if(pointer >= nodeNum) {
      d3.range(0, 10).map(function(d){
        var sIndex = Math.floor(Math.random()*nodeNum);
        var tIndex = Math.floor(Math.random()*nodeNum);
        links.push({source: nodes[sIndex], target: nodes[tIndex]});
        update();
        return 0;
      });
      window.clearInterval(connect);
      infect();
    }
    force.start();
  }, 200);

  var infect = function(){
    nodes[0].infected = true;
    svg.selectAll(".node")
      .filter(function(d) { return d.index===0; })
      .transition()
        .duration(500)
        .ease("bounce")
      .attr("r",11)
      .style("fill", "#d9534f");

    var infectInterval = setInterval(function () {

      var newInfected = _.map(links, function(l){
        if(l.source.infected){
          if(!l.target.infected && Math.random() > 0.5){
            return {s: l.source.index, t:l.target.index};
          }
        } else if (l.target.infected){
          if(!l.source.infected && Math.random() > 0.5){
            return {s: l.target.index, t: l.source.index};
          }
        }
        return -1;
      });

      newInfected = _.filter(newInfected, function(d){ return d != -1;});

      var virus = svg.selectAll(".virus")
        .data(newInfected)
        .enter().append("circle")
            .attr("class", "virus")
            .attr("cx", function(d) { return nodes[d.s].x; })
            .attr("cy", function(d) { return nodes[d.s].y; })
            .attr("r", 4)
          .transition()
            .duration(300)
            .attr("cx", function(d) { return nodes[d.t].x; })
            .attr("cy", function(d) { return nodes[d.t].y; });

      virus.remove();

      svg.selectAll(".node")
        .filter(function(d) {
          var toInfect = _.find(newInfected, function(i){return i.t == d.index;});
          if(toInfect !== undefined) { d.infected = true; }
          return toInfect !== undefined; })
        .transition()
          .duration(500)
          .ease("bounce")
        .attr("r",11)
        .style("fill", "#d9534f");

      var nonInfected = _.filter(nodes, function(n){return !n.infected;});
      if(nonInfected.length === 0) {
        window.clearInterval(infectInterval);
      }

      force.start();
    }, 1000);
  };

  var update = function () {
    var link = svgBack.selectAll("line")
      .data(links);

    link.enter().append("line")
        .attr("class","link")
        .style("stroke-width", 2);
    link.exit().remove();
  };

};
