
// getting the outer canvas
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  radius = 40;

  var aspect = width / height;
d3.select(window)
  .on("resize", function() {
    
    var targetWidth = svg.node().getBoundingClientRect().width;
    var wid = document.documentElement.clientWidth;
    svg.attr("width", wid);
    svg.attr("height", wid / aspect);
  });


// drawing the big circle in the middle of the svg
var circle = svg.append("circle")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", 350);

// creating a g element that contians a rect and a label
var g = svg.append("g");
var rect = g.append("rect")
  .attr("x", 100)
  .attr("y", height - 100)
  .attr("width", 100)
  .attr("height", 100);

// defining the count of the label to keep increment
var count = 0;
var boxLabel = g.append("text").attr("dx", rect.attr("x")).attr("dy", rect.attr("y"))
rectCenter = { x: 150, y: (height - 100) + 50 };


// creating the array of random circle positions inside the big circle
var circles = d3.range(30).map(function (i) {
  return {
    x: Math.round(Math.random() * 125 + (width / 2)),
    y: Math.round(Math.random() * 125 + (height / 2))
  };
});

// assiging random colors
var color = d3.scaleOrdinal()
  .range(d3.schemeCategory20);


// adding nessesary proberties to the random circles 
var node = svg.selectAll("circle")
  .data(circles)
  .enter().append("circle")
  .attr("class", "element")
  .attr("cx", function (d) { return d.x; })
  .attr("cy", function (d) { return d.y; })
  .attr("r", radius)
  .style("fill", function (d, i) { return color(i); })



// make the randrom circles draggable
  node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
    .on("drag.force", function (d) {
      d.fixed = true;
    }));

// forces variables for starting a force simulation
var attractForce = d3.forceManyBody().strength(200).distanceMax(125).distanceMin(60);
var repelForce = d3.forceManyBody().strength(-140).distanceMax(50).distanceMin(10);
var collisionForce = d3.forceCollide(45).strength(1).iterations(1);
var simulation;



// starting the force simulation on the 
// random circles to center the circles around the center
simulation = d3.forceSimulation(circles)
  .force("collisionForce", collisionForce)
  //.force("charge", d3.forceManyBody())
  //.force("center", d3.forceCenter(width / 2, height / 2))
  //.force("attractForce", attractForce)
  //.force("repelForce", repelForce)
  .force("forceX", d3.forceX().strength(.1).x(width * .5))
  .force("forceY", d3.forceY().strength(.1).y(height * .5))


// disable the force after the elements are centered
setTimeout(function () {
  simulation
    .force("forceX", d3.forceX().strength(0))
    .force("forceY", d3.forceY().strength(0))
}, 2000)


function stopForce(d) {
  d.attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
}

// called on the start of element dragging
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

// called during the dragging
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

// called after the dragging
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  // check the distance of the dragged random circle compared rect box
  var distance = Math.sqrt(Math.pow(d.x - rectCenter.x, 2) + Math.pow(d.y - rectCenter.y, 2));
  if (distance < 81.1) {
    d.fx = rectCenter.x;
    d.fy = rectCenter.y;
    //node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node);
    boxLabel.text(++count);
    //runSimulation();
  } else {
    d.fx = null;
    d.fy = null;
  }
}



function ticked() {

  node.attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
}
// force simulation start
simulation
  .on("tick", ticked)