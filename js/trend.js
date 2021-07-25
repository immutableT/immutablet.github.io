import { Barchart} from "./barchart.js";

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

  d3.csv(dataFile).then(function(data) {
    let barchart = new Barchart(rootElement, margin.left, margin.right, margin.top, margin.bottom, yDomain, year, data);
    let tooltip = d3.select("#tooltip-barchart");
    barchart.SVG.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", function(d) {return barchart.GetStyle(d)})
      .attr("x", function(d) { return barchart.GetBarX(d);})
      .attr("y", function(d) { return barchart.YScale(d[key]); })
      .attr("width", function(d) { return barchart.GetBarWidth(d);})
      .attr("height", barchart.YScale.bandwidth())
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

    barchart.SVG.append("g")
      .attr("class", "axis-x")
      .attr("transform", barchart.XAxisTranslation)
      .call(barchart.XAxis);

    barchart.SVG.append("g")
      .attr("class", "axis-y")
      .attr("transform", barchart.YAxisTranslation)
      .call(barchart.YAxis);
  });
}

export function UpdateGPITrendBarchart(year) {
  d3.csv("data/gpi-by-region.csv").then(function(data) {
    let barchart = new Barchart("#trend", margin.left, margin.right, margin.top, margin.bottom, yDomain, year, data);
    let svg = d3.select("#trend");
    let previousYear = (parseInt(year) - 1).toString();

    svg.selectAll("rect")
      .data(data)
      .transition()
      .attr("class", function(d) {return barchart.GetStyle(d)})
      .attr("x", function(d) { return barchart.GetBarX(d);})
      .attr("width", function(d) { return barchart.GetBarWidth(d);})

    svg.select(".axis-x")
      .attr("transform", "translate(0," + (barchart.YScale.range()[1]) + ")")
      .call(barchart.XAxis);

    svg.select(".axis-y")
      .attr("transform", "translate(" + barchart.XScale(0) + ",0)")
      .call(barchart.YAxis);
  });
}

