//import * as d3 from "./d3.min.js";

let svg = d3.select("body").append("svg");
let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);
let url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";

d3.json(url).then(function(geojson) {
  // svg.append("path").attr("d", path(geojson));
  svg.selectAll("path")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path);
})
