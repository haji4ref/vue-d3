<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<style>

.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

text {
  font-family: sans-serif;
  font-size: 10px;
}

.icons{
  z-index: 10;
}

</style>
</head>



<body >

<svg width="960" height="600">

</svg>

<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

/*var color =d3.scaleOrdinal()
      .range(["red", "green", "blue", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
*/
var icons= d3.scaleOrdinal()
      .range(["icons/router.svg", "icons/servers.svg", "icons/pc-screen.svg"]);
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("center", d3.forceCenter(width/2, height/2))
    .force("x",d3.forceX(width/2).strength(0.5))
    .force("y",d3.forceY(height/2).strength(0.5))
    .force("charge",d3.forceManyBody().strength(-1000));

d3.json("rsc.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")

var rect= node.append("rect")
            .attr("width",15)
            .attr("height", 15)
            .attr('x', -7)
            .attr('y', -7)
            .attr( 'fill', 'white');

var serverrouterclient= node.append("image")
            .attr("class","icons")
            .attr("xlink:href", function(d){
              //console.log(d.group);
              //console.log(icons(d.group));
              return icons(d.group);})
            .attr("width", 20)
            .attr("height", 20)
            .attr('x', -10)
            .attr('y', -10)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

/*  var circles = node.append("circle")
      .attr("r", 5)
      .style("backgroundcolor", function(d){
        return icons(d.group);})
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
*/
  var lables = node.append("text")
      .text(function(d) {
        return d.id;
      })
      .attr('x', 6)
      .attr('y', 3)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = d.x;
  d.fy = d.y;
}

</script>
</body>


</html>
