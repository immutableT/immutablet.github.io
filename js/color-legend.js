export function CreateLegend(containerID, showDataNotAvail) {
  let colorLegend = [
    {color: "rgb(204, 204, 204)", text: "Data not available" },
    {color: "rgb(14,63,153)", text: `1.5 "&#8593;" More Peaceful"`},
    {color: "rgb(73,93,154)", text:"2.0"},
    {color: "rgb(155,163,193)", text:"2.5"},
    {color: "rgb(206,136,125)", text: "3.0"},
    {color: "rgb(196,58,31)", text:`3.5" "&#8595" Less Peaceful`}
  ]
  if (!showDataNotAvail) {
    colorLegend.shift();
  }

  let svg = d3.select(containerID);
  let x = 50;
  let r = 6;
  let fontSize = "17px"

  let y = 130;
  for (let i = 0; i < colorLegend.length; i++) {
    svg.append("circle")
      .attr("cx", x)
      .attr("cy",y)
      .attr("r", r)
      .style("fill", colorLegend[i].color)

    svg.append("text")
      .attr("x", x + 20)
      .attr("y", y)
      .html(colorLegend[i].text)
      .style("font-size", fontSize)
      .attr("alignment-baseline","middle")
    y += 30;
  }
}
