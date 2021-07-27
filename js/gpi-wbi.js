const margin = {top: 20, right: 30, bottom: 40, left: 30};

export function CreateGPI2WBIScatterPlot(year) {
  var w = 800;
  var h = 600;

  let gpiKey = `gpi-${year}`;
  let wbiKey = `wbi-${year}`;

  d3.csv('./data/gpi-wbi.csv').then(function(data) {

    let xScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return parseFloat(d[gpiKey]);
      })])
      .range([0, w]);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return parseInt(d[wbiKey]);
      })])
      .range([0, h]);

    console.log(`${yScale.domain()}`)

    let svg = d3.select("#scatter-plot")
      .attr("width", w)
      .attr("height", h)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("circle")
      .data(data)
      .enter()
      .filter(function(d) { return !isNaN(parseInt(d[wbiKey]))})
      .append("circle")
      .attr("cx", function (d) {
        return xScale(parseFloat(d[gpiKey]));
      })
      .attr("cy", function (d) {
        let cy = parseInt(d[wbiKey]);
        console.log(`cy: ${yScale(cy)}`)
        return yScale(cy);
        // console.log(`cy: ${cy}`)
        // if (isNaN(cy)) {
        //   return 0;
        // }
        // return cy;
      })
      .attr("r", function (d) {
        return 5;
      });
  });
}


