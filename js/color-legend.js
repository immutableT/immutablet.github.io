let colorLegend = [
  "rgb(14,63,153)",
  "rgb(73,93,154)",
  "rgb(155,163,193)",
  "rgb(206,136,125)",
  "rgb(196,58,31)"
]


export function CreateLegend(containerID, showDataNotAvail) {
  let svg = d3.select(containerID);
  let x = 50;
  let r = 6;
  let fontSize = "17px"

  if (showDataNotAvail) {
    svg.append("circle")
      .attr("cx", x)
      .attr("cy",100)
      .attr("r", r)
      .style("fill", "#CCC")

    svg.append("text")
      .attr("x", x + 20)
      .attr("y", 100)
      .html("Data not available")
      .style("font-size", fontSize)
      .attr("alignment-baseline","middle")
  }

  svg.append("circle")
    .attr("cx", x)
    .attr("cy",130)
    .attr("r", r)
    .style("fill", "#0E3F99FF")
  svg.append("circle").
  attr("cx", x)
    .attr("cy",160)
    .attr("r", r)
    .style("fill", "#495D9AFF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",190)
    .attr("r", r)
    .style("fill", "#9BA3C1FF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",220)
    .attr("r", r)
    .style("fill", "#CE887DFF")
  svg.append("circle")
    .attr("cx", x)
    .attr("cy",250)
    .attr("r", r)
    .style("fill", "#C43A1FFF")

  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 130)
    .html("1.5 " + "&#8593;" + "More Peaceful")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 160)
    .text("2.0")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 190)
    .text("2.5")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 220)
    .text("3.0")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
  svg.append("text")
    .attr("x", x + 20)
    .attr("y", 250)
    .html("3.5" + "&#8595" + "Less Peaceful")
    .style("font-size", fontSize)
    .attr("alignment-baseline","middle")
}
