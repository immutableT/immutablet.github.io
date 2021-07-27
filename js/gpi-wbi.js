const margin = {top: 20, right: 30, bottom: 40, left: 30};

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
      .domain([0, d3.max(data, function (d) {
        return getX(d);
      })])
      .range([0, w]);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return getY(d);
      })])
      .range([h, 0]);

    console.log(`xScale: ${xScale.domain()}`);
    console.log(`yScale: ${yScale.domain()}`);

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
      .attr("r", function (d) {
        return 2;
      });
  });
}


