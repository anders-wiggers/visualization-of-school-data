// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var csv=[]
// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(6000)
  .center([12,56])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);
// Load external data and boot

var svgText = svg.append("text");

d3.csv("kommuner.csv", function(p) {
    return {
        x : p.X,
        y : p.Y,
        kommune : p.KOMNAVN
    };
}).then(function(p){
    csv.push(p)
});


var worldmap = d3.json("kommuner.geojson");
Promise.all([worldmap]).then(function(topo){
  let mouseOver = function(d) {
    d3.selectAll("text")
    d3.select(this)
      .style("stroke", "red")
    svgText.attr("x",50)
            .attr("y",50)
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