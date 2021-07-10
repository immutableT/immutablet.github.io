let margin = {top: 20, right: 30, bottom: 40, left: 30},
  width = 900 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

let xScale = d3.scaleLinear().range([0, width]);
let yScale = d3.scaleBand().domain([
  "Europe",
  "North America",
  "Asia-Pacific",
  "CA and Caribbean",
  "Russia and Eurasia",
  "Sub-Saharan Africa",
  "South-Asia",
  "Middle East and North Africa"
]).range([0, height]);

let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

// No labels.
// let yAxis = d3.axisLeft(yScale).tickValues([]);

let svg = d3.select("#trend")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/trend.csv").then(function(data) {
  xScale.domain(d3.extent(data, function (d) {return parseFloat(d['change'])})).nice();

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
