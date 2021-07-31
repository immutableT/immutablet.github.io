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

    // console.log(`xScale: ${xScale.domain()}`);
    // console.log(`yScale: ${yScale.domain()}`);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
    let tooltip = d3.select("#tooltip-scatter-plot")

    let svg = d3.select("#scatter-plot")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("id", "scatter-plot-container")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .filter(function(d) { return !isNaN(getY(d))})
      .append("circle")
      .attr("id", function(d) { return d.Country; })
      .attr("cx", function (d) {
        return xScale(getX(d));
      })
      .attr("cy", function (d) {
        return yScale(getY(d));
      })
      .attr("fill", function(d) {return color(getX(d));})
      .attr("r", function (d) {
        return 4;
      })
      .on("mouseover", attachTooltip)
      .on("mouseout", function() {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0);
      })

    svg.append("g")
      .attr("class", "axis-x")
      .attr("transform","translate(0," + h + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis-y")
      .call(yAxis);

    attachAnnotations();

  });
}

function attachTooltip(d) {
  let tooltip = d3.select("#tooltip-scatter-plot")
    .style('left', d.clientX + 'px')
    .style('top', d.clientY + 'px')
  let record = d3.select(this).data()[0];
  let country = record['Country'];
  let gdp = d3.format("($.2f")(record['wbi-2019']);
  let gpi = d3.format("(1.2f")(record['gpi-2019']);
  let tip = `${country}<br>GDP Per Capita: ${gdp}<br>Global Peace Indicator: ${gpi}`

  tooltip.transition()
    .duration(200)
    .style("opacity", .9);
  tooltip.html(tip)
    .style('left', d.clientX + 'px')
    .style('top', d.clientY + 'px')

  console.log(`Left: ${tooltip.style("left")}  Top: ${tooltip.style("top")}`)
}

function attachAnnotations() {
  let peacefulAndProsperousMark = d3.select("#Norway");
  let xPeacefulAndProsperous = peacefulAndProsperousMark.attr("cx");
  let yPeacefulAndProsperous = peacefulAndProsperousMark.attr("cy");

  let notPeacefulAndNotProsperous = d3.select("#Russia");
  let xNotPeacefulAndNotProsperous = notPeacefulAndNotProsperous.attr("cx");
  let yNotPeacefulAndNotProsperous = notPeacefulAndNotProsperous.attr("cy");

  const annotations = [
    {
      note: {
        //label: "GDP: $92,556 GPI: 1.47",
        title: "Norway"
      },
      color: ["#0E3F99FF"],
      dx: xPeacefulAndProsperous - 100,
      dy: yPeacefulAndProsperous,

      x: xPeacefulAndProsperous,
      y: yPeacefulAndProsperous
    },
    {
      note: {
        //label: "GDP: $573 GPI: 3.57",
        title: "Russia",
      },
      color: ["#C43A1FFF"],
      // End of the connector
      dx: xNotPeacefulAndNotProsperous - 650,
      dy: yNotPeacefulAndNotProsperous - 450,
      // Center of the circle
      x: xNotPeacefulAndNotProsperous,
      y: yNotPeacefulAndNotProsperous
    },
  ]

  const makeAnnotations = d3.annotation()
    .type(d3.annotationCalloutCircle)
    .annotations(annotations)

  d3.select("#scatter-plot-container")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
}




