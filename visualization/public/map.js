  var w = 1400;
  var h = 700;
  var kommunes = [];
  var antalKommuner = [];
  var long;
  var svg = d3.select("div#container")
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .style("background-color","#c9e8fd")
              .attr("viewBox", "0 0 " + w + " " + h)
              .classed("svg-content", true);
  var projection = d3.geoMercator()
              .translate([w/2, h/2])
              .scale(6000)
              .center([12,56]);
  var path = d3.geoPath().projection(projection);

d3.json("kommuner.geojson").then(worldmap => {    
// draw map
for(var foo in worldmap.features){
  var obj = worldmap.features[foo]
  var listeAfKommuner = obj.properties.KOMNAVN
    svg.selectAll("path")
    .data(worldmap.features)
    .enter()
    .append("path")
    .attr("class","continent")
    .attr("d", path)
    antalKommuner.push(obj)
    kommunes.push(listeAfKommuner)
    for(var bar in obj.geometry.coordinates) {
      long = obj.geometry.coordinates[bar]
      // draw points
      svg.selectAll("circle")
      .data(long)
      .enter()
      .append("circle")
      .attr("class","circles")
      .attr("cx", function(d) {return projection([JSON.stringify(d[0]),JSON.stringify(d[1])])[0]})
      .attr("cy", function(d) {return projection([JSON.stringify(d[0]),JSON.stringify(d[1])])[1]})
      .attr("r", "1px")

      svg.selectAll("text")
      .data(kommunes)
      .enter()
      .append("text")
      .text(function(d) {
              return JSON.stringify(d);
          })
      .attr("cx", function(d) {return projection([JSON.stringify(d[0]),JSON.stringify(d[1])])[0]})
      .attr("cy", function(d) {return projection([JSON.stringify(d[0]),JSON.stringify(d[1])])[1]})
      .attr("class","labels");  
      
  }
}
// add labels
console.log(antalKommuner.length)


function removeDuplicates(kommunes) {
  return kommunes.filter((a, b) => kommunes.indexOf(a) === b)
}

console.log(removeDuplicates(kommunes))
  }); 
 