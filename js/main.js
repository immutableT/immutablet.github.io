//import * as d3 from "./d3.min.js";

let margin = {top: 0, right: 0, bottom: 0, left: 0};
let width  = 960 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;
let projection = d3.geoMercator().scale(130).translate( [width / 2, height / 1.5]);
const color = d3.scaleQuantize()
  .range([
    "rgb(14,63,153)",
    "rgb(73,93,154)",
    "rgb(155,163,193)",
    "rgb(206,136,125)",
    "rgb(196,58,31)"]
  );

let svg = d3.select("body").append("svg");
let tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip')
  .attr("class", "tooltip");

let path = d3.geoPath().projection(projection);

function drawGlobalPeaceIndexMap(year) {
  d3.csv("data/overall.csv").then(function(data) {
    let min = d3.min(data, function(d) { return d[year]; });
    let max = d3.max(data, function(d) { return d[year]; });

    color.domain([min, max]);

    d3.json("data/world.geo.json").then(function(geojson) {
      for (let i = 0; i < data.length; i++) {
        let dataCountry = data[i].Country;
        let score = parseFloat(data[i][year]);
        // console.log(`${dataCountry} ${score}`)

        for (let j = 0; j < geojson.features.length; j++) {
          if (dataCountry === geojson.features[j].properties.name) {
            geojson.features[j].properties.value = score;
            // console.log(`Matched ${dataCountry}`)
            break;
          }
        }
      }

      svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
          let score = d.properties.value;
          if (score) {
            return color(score);
          } else {
            //If value is undefined…
            return "#ccc";
          }
        })
        .on("mouseover", function(d) {
          console.log(d)
          let country = d3.select(this).data()[0].properties.name
          let score = d3.select(this).data()[0].properties.value
          if (!score) {
            score = "data not available"
          }

          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(country + "<br/>" + score)
            .style('left', d.clientX + 'px')
            .style('top', d.clientY + 'px')
        })
        .on("mouseout", function() {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        })
    });
  });
}

drawGlobalPeaceIndexMap('2021');



