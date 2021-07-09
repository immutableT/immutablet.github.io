let margin = {top: 20, right: 30, bottom: 40, left: 30},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let xScale = d3.scaleLinear().range([0, width]);
let yScale = d3.scaleBand().domain([
  "Europe",
  "Asia-Pacific",
  "Central America and the Caribbean",
  "Russia and Eurasia",
  "Sub-Saharan Africa",
  "South-Asia",
  "Middle East and North Africa"
]).range([0, height]);

let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

let svg = d3.select("#trend")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/trend.csv").then(function(data) {
  let min = d3.min(data, function(d) { return d['change']; });
  let max = d3.max(data, function(d) { return d['change']; });
  xScale.domain([min, max]);

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", function(d) { return "bar bar--" + (parseFloat(d['change']) < 0 ? "negative" : "positive"); })
    .attr("x", function(d) { return xScale(Math.min(0, parseFloat(d['change']))); })
    .attr("y", function(d) { return yScale(d['region']); })
    .attr("width", function(d) { return Math.abs(xScale(parseFloat(d['change'])) - xScale(0)); })
    .attr("height", yScale.bandwidth());

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + xScale(0) + ",0)")
    .call(yAxis);

});
