// import * as d3 from "./d3.min.js";


// d3.csv("data/overall.csv").then(function(data) {
//   console.log(data[0]);
// });

var width = 900;
var height = 500;

var svg = d3.select("body").append("svg")
var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);
var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

d3.json(url).then(function(geojson) {
  // svg.append("path").attr("d", path(geojson));
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path);
})

// var svg = d3.select("body").append("svg");
// var path = d3.geoPath().projection(d3.geoMercator());
// d3.json("data/world.json").then(function(world) {
//   console.log(world)
//   svg.selectAll("path")
//     .data(topojson.feature(world,world.objects.countries).features)
//     .enter()
//     .append("path")
//     .attr("d", path);
// });
