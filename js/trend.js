import { GetYScale } from "./barchart.js";
import { GetXScale } from "./barchart.js";
import { GetDelta } from "./barchart.js";
import { GetStyle } from "./barchart.js";

const margin = {top: 20, right: 30, bottom: 40, left: 30};
const yDomain = [
  "Africa",
  "South/Latin America",
  "Europe",
  "Arab States",
  "Middle East",
  "North America",
  "Asia & Pacific",
]

export function CreateGPITrendByRegionBarchart(year, rootElement, dataFile, key) {
  console.log(`Generating barchart for year ${year}`);
  let xScale = GetXScale(rootElement, margin.left, margin.right);
  let yScale = GetYScale(rootElement, yDomain, margin.top, margin.bottom);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

  let svg = d3.select(rootElement)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let tooltip = d3.select("#tooltip-barchart");

  d3.csv(dataFile).then(function(data) {
    let previousYear = (parseInt(year) - 1).toString();
    xScale.domain(d3.extent(
      data, function(d) { return GetDelta(d, year, previousYear)})).nice();

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", function(d) {return GetStyle(d, year, previousYear)})
      .attr("x", function(d) { return xScale(Math.min(0, GetDelta(d, year, previousYear))); })
      .attr("y", function(d) { return yScale(d[key]); })
      .attr("width", function(d) { return Math.abs(xScale(GetDelta(d, year, previousYear)) - xScale(0)); })
      .attr("height", yScale.bandwidth())
      .on("mouseover", function(d) {
        console.log("mouseover event with data:", d3.select(this).data());
        let bar = d3.select(this)
        let score = parseFloat(bar.data()[0][year]).toFixed(2);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("overall score:" + "<br/>" + score)
          .style('left', d.clientX + 'px')
          .style('top', d.clientY + 'px')
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      });

    svg.append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + (yScale.range()[1]) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis-y")
      .attr("transform", "translate(" + xScale(0) + ",0)")
      .call(yAxis);
  });
}

export function UpdateGPITrendBarchart(year) {
  let xScale = GetXScale("#trend", margin.left, margin.right);
  let yScale = GetYScale("#trend", yDomain, margin.top, margin.bottom);
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
  let svg = d3.select("#trend");

  d3.csv("data/gpi-by-region.csv").then(function(data) {
    let previousYear = (parseInt(year) - 1).toString();
    xScale.domain(d3.extent(
      data, function(d) { return GetDelta(d, year, previousYear)})).nice();

    svg.selectAll("rect")
      .data(data)
      .transition()
      .attr("class", function(d) {return GetStyle(d, year, previousYear)})
      .attr("x", function(d) { return xScale(Math.min(0, GetDelta(d, year, previousYear))); })
      .attr("width", function(d) { return Math.abs(xScale(GetDelta(d, year, previousYear)) - xScale(0)); })

    svg.select(".axis-x")
      .attr("transform", "translate(0," + (yScale.range()[1]) + ")")
      .call(xAxis);

    svg.select(".axis-y")
      .attr("transform", "translate(" + xScale(0) + ",0)")
      .call(yAxis);
  });
}

