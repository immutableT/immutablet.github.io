//import * as d3 from "./d3.min.js";
const color = d3.scaleQuantize()
  .range([
    "rgb(14,63,153)",
    "rgb(73,93,154)",
    "rgb(155,163,193)",
    "rgb(206,136,125)",
    "rgb(196,58,31)"]
  );

let projection = d3.geoMercator()
let path = d3.geoPath().projection(projection);
let svgWorldMap = d3.select("#map");
const width = parseInt(svgWorldMap.style("width").replace("px", ""));
const height = parseInt(svgWorldMap.style("height").replace("px", ""));

let zooming = function (event, _) {
  // console.log(event.transform);
  let offset = [event.transform.x, event.transform.y];
  let newScale = event.transform.k * 2000;
  //Update projection with new offset and scale
  projection.translate(offset).scale(newScale);
  //Update all paths and circles
  svgWorldMap.selectAll("path").attr("d", path);
}
let zoom = d3.zoom().scaleExtent([0.05, 2.0]).on("zoom", zooming);

svgWorldMap
  .call(zoom)
  .call(zoom.transform, d3.zoomIdentity
  .translate(width/2, height/1.5)
  .scale(0.06));

let tooltip = d3.select('body')
  .append('div')
  .attr('id', 'tooltip-map')
  .attr("class", "tooltip-map");

function drawGlobalPeaceIndexMap(year) {
  console.log(`Generating map for year ${year}`)
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

      svgWorldMap.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
          let score = d.properties.value;
          if (score) {
            // console.log(`Found score of ${score} for ${d.properties.name}`)
            return color(score);
          } else {
            //If value is undefined…
            return "#ccc";
          }
        })
        .on("mouseover", function(d) {
          // console.log("mouseover event:", d);
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

function drawLegend() {
  let svg = d3.select("#map-legend");
  let x = 50;
  let r = 6;

  svg.append("circle")
    .attr("cx", x)
    .attr("cy",100)
    .attr("r", r)
    .style("fill", "#CCC")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",130)
    .attr("r", r)
    .style("fill", "#0E3F99FF")
  svg.append("circle").
    attr("cx", x)
    .attr("cy",160)
    .attr("r", r)
    .style("fill", "#495D9AFF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",190)
    .attr("r", r)
    .style("fill", "#9BA3C1FF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",220)
    .attr("r", r)
    .style("fill", "#CE887DFF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",250)
    .attr("r", r)
    .style("fill", "#C43A1FFF")

  let fontSize = "17px"
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 100)
    .html("Data not available")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 130)
    .html("1.5 " + "&#8593;" + "More Peaceful")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 160)
    .text("2.0")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 190)
    .text("2.5")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 220)
    .text("3.0")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 250)
    .html("3.5" + "&#8595" + "Less Peaceful")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
}

drawGlobalPeaceIndexMap('2021');
drawLegend();

d3.select("#year")
  .on("change", function(e) {
    console.log("Year selection changed", e);
    let year = eval(d3.select(this).property('value'));
    console.log("Year selection changed", year);
    svgWorldMap.selectAll("path").remove();
    drawGlobalPeaceIndexMap(year);
    // drawLegend();
})







