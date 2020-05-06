$("#map").click(function() {
  d3.select("svg").remove()
});
var svg = d3.select("chartContent").append("svg")
console.log("PRinting")    
    fetch('/api/combine?data=planned_hours&school=Ida Holsts Skole')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
  
        response.json().then(function(data) {
          console.log(data)

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });