var svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 30, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;
var schools = []
var i;
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    fetch('/api/combine?data=planned_hours&school=Ida Holsts Skole')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        response.json().then(function(data) {
         x.domain(data.map(function(d) {return d.first_grade}));
         y.domain([0, d3.max(data, function(d){return d.YEAR})])
        
         g.append("g")
         .attr("class", "axis axis--x")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));

         g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "%"))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");
        
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.first_grade); })
              .attr("y", function(d) { return y(d.YEAR); })
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - 1});
         
         
         
            console.log(data)
            for(i=0; i < data.length; i++){
                
            }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

  