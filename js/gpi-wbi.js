export function CreateGPI2WBIScatterPlot(year) {
  var w = 800;
  var h = 400;

  let gpiKey = `gpi-${year}`;
  let wbiKey = `wbi-${year}`;

  d3.csv('./data/gpi-wbi.csv').then(function(data) {

    let xScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return d[gpiKey];
      })])
      .range([0, w]);

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) {
        return d[wbiKey];
      })])
      .range([0, h]);

    let svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(parseFloat(d[gpiKey]));
      })
      .attr("cy", function (d) {
        let cy = parseFloat(d[wbiKey]);
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


