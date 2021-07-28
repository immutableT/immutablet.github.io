const margin = {top: 20, right: 30, bottom: 40, left: 60};
const color = d3.scaleQuantize()
  .range([
    "rgb(14,63,153)",
    "rgb(73,93,154)",
    "rgb(155,163,193)",
    "rgb(206,136,125)",
    "rgb(196,58,31)"]
  );

export function CreateGPI2WBIScatterPlot(year) {
  const w = 960 - margin.left - margin.right;
  const h = 500 - margin.top - margin.bottom;

  let xKey = `gpi-${year}`;
  let yKey = `wbi-${year}`;

  let getX = function(d) {
    return parseFloat(d[xKey]);
  }
  let getY = function(d) {
    return parseInt(d[yKey]);
  }

  d3.csv('./data/gpi-wbi.csv').then(function(data) {
    let xScale = d3.scaleLinear()
      .domain([1, d3.max(data, function (d) {
        return getX(d);
      })])
      .range([0, w]);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return getY(d);
      })])
      .range([h, 0]);

    color.domain([
      d3.min(data, function(d) { return d[xKey]; }),
      d3.max(data, function(d) { return d[xKey]; })
    ])

    console.log(`xScale: ${xScale.domain()}`);
    console.log(`yScale: ${yScale.domain()}`);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);

    let svg = d3.select("#scatter-plot")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .filter(function(d) { return !isNaN(getY(d))})
      .append("circle")
      .attr("cx", function (d) {
        return xScale(getX(d));
      })
      .attr("cy", function (d) {
        return yScale(getY(d));
      })
      .attr("fill", function(d) {return color(getX(d));})
      .attr("r", function (d) {
        return 3;
      });

    svg.append("g")
      .attr("class", "axis-x")
      .attr("transform","translate(0," + h + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis-y")
      .call(yAxis);
  });
}


