//import * as d3 from "./d3.min.js";

let margin = {top: 0, right: 0, bottom: 0, left: 0};
let width  = 960 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;
let projection = d3.geoMercator().scale(130).translate( [width / 2, height / 1.5]);

let svg = d3.select("body").append("svg");
let path = d3.geoPath().projection(projection);
// let url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

d3.json("data/world.geo.json").then(function(geojson) {
  // svg.append("path").attr("d", path(geojson));
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path);
})

d3.csv("data/overall.csv").then(function(data) {
  console.log(data[0]);
});
