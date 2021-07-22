

export function drawGlobalPeaceIndexTrendBarchart(year) {
  console.log(`Generating barchart for year ${year}`);

  let margin = {top: 20, right: 30, bottom: 40, left: 30};
  const width = 1230;
  const height = 300;

  let xScale = d3.scaleLinear().range([0, width - margin.left - margin.right]);
  let yScale = d3.scaleBand().domain([
    "Africa",
    "South/Latin America",
    "Europe",
    "Arab States",
    "Middle East",
    "North America",
    "Asia & Pacific",
  ]).range([0, height - margin.top - margin.bottom]);

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

  let svg = d3.select("#trend")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let tooltip = d3.select("#tooltip-barchart");

  d3.csv("data/gpi-by-region.csv").then(function(data) {
    let previousYear = (parseInt(year) - 1).toString();
    let delta = function(d) {
      let yearVal = parseFloat(d[year])
      let prevYearVal = parseFloat(d[previousYear]);
      return yearVal - prevYearVal;
    }

    let getStyle = function(d) {
      if (delta(d) > 0) {
        return "positive";
      }

      return "negative"
    }

    xScale.domain(d3.extent(data, delta)).nice();

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", getStyle)
      .attr("x", function(d) { return xScale(Math.min(0, delta(d))); })
      .attr("y", function(d) { return yScale(d['Region']); })
      .attr("width", function(d) { return Math.abs(xScale(delta(d)) - xScale(0)); })
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
      .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis-y")
      .attr("transform", "translate(" + xScale(0) + ",0)")
      .call(yAxis);
  });
}
