// The svg
$(".chartButton").click(function() {
  d3.selectAll("svg").remove()
});
var svg = d3.select("mapContent").append("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

var schoolData=[]
// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(5000)
  .center([11,56])
  .translate([width / 2, height / 2]);

var svgText = svg.append("text");


/* d3.csv("kommuner.csv", function(p) {
    return {
        x : p.X,
        y : p.Y,
        kommune : p.KOMNAVN
    };
}).then(function(p){
    csv.push(p)
}); */


var worldmap = d3.json("kommuner.geojson");

Promise.all([worldmap]).then(function(topo){
  let mouseOver = function(d) {
    d3.select(this)
      .style("stroke", "red")
    svgText.selectAll("text")
    svgText.attr("x", 50)
    svgText.attr("y",50)
    svgText.attr("class", "test")
    svgText.text(d.properties.KOMNAVN)
  }

  let mouseLeave = function(d) {
    d3.selectAll(".KOMNAVN2")
    d3.select(this)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo[0].features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", "gray")
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
})