import { Barchart} from "./barchart.js";

const margin = {top: 20, right: 30, bottom: 40, left: 30};
const yDomain = [
  "2021","2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009"
]

export function CreateGPITrendByCountryBarchart(year, rootElement, dataFile, key) {
  d3.csv(dataFile).then(function(data) {
    let barchart = new Barchart(rootElement, margin.left, margin.right, margin.top, margin.bottom, yDomain, year, data);
    barchart.SVG.selectAll("rect")
      .data(barchart.Data)
      .enter()
      .append("rect")
      .attr("class", function(d) {return barchart.GetStyle(d)})
      .attr("x", function(d) { return barchart.GetBarX(d);})
      .attr("y", function(d) { return barchart.YScale(d[key]); })
      .attr("width", function(d) { return barchart.GetBarWidth(d);})
      .attr("height", barchart.YScale.bandwidth())

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


