// import * as d3 from "./d3.min.js";


// d3.csv("data/overall.csv").then(function(data) {
//   console.log(data[0]);
// });


var svg = d3.select("body").append("svg").attr("width", 1020).attr("height", 600);
var path = d3.geoPath().projection(d3.geoMercator());
d3.json("data/world.json").then(function(world) {
  console.log(world)
  svg.selectAll("path")
    .data(topojson.feature(world,world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path);
});

// var path = d3.geoPath().projection(d3.mercator);

// var svg = d3.select("body")
//   .append("svg")
//   .attr("width", 500)
//   .attr("height", 400);

// d3.json("data/world.geo.json").then(function(world) {
//   svg.selectAll("path")
//     .data(world)
//     .enter()
//     .append("path")
//     .attr("d", path);
// });

// d3.json("uk.json", function(error, uk) {
//   if (error) return console.error(error);
//   console.log(uk);
// });
