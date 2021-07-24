const margin = {top: 20, right: 30, bottom: 40, left: 30};

function getXScale() {
  const width = parseInt(d3.select("#trend").style("width").replace("px", ""));
  return d3.scaleLinear().range([0, width - margin.left - margin.right]);
}

function getYScale() {
  const height = parseInt(d3.select("#trend").style("height").replace("px", ""));
  return d3.scaleBand().domain([
    "Africa",
    "South/Latin America",
    "Europe",
    "Arab States",
    "Middle East",
    "North America",
    "Asia & Pacific",
  ]).rangeRound([0, height - margin.top - margin.bottom])
    .paddingInner(0.05);
}

function delta(d, year, previousYear) {
  let yearVal = parseFloat(d[year])
  let prevYearVal = parseFloat(d[previousYear]);
  return yearVal - prevYearVal;
}

function getStyle(d, year, previousYear) {
  if (delta(d, year, previousYear) > 0) {
    return "positive";
  }

  return "negative"
}

export function drawGlobalPeaceIndexTrendBarchart(year) {
  console.log(`Generating barchart for year ${year}`);
  let xScale = getXScale();
  let yScale = getYScale();

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

  let svg = d3.select("#trend")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let tooltip = d3.select("#tooltip-barchart");

  d3.csv("data/gpi-by-region.csv").then(function(data) {
    let previousYear = (parseInt(year) - 1).toString();
    xScale.domain(d3.extent(data, function(d) { return delta(d, year, previousYear)})).nice();

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", function(d) {return getStyle(d, year, previousYear)})
      .attr("x", function(d) { return xScale(Math.min(0, delta(d, year, previousYear))); })
      .attr("y", function(d) { return yScale(d['Region']); })
      .attr("width", function(d) { return Math.abs(xScale(delta(d, year, previousYear)) - xScale(0)); })
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
