export function GetXScale(containerID, marginLeft, marginRight) {
  const width = parseInt(d3.select(containerID).style("width").replace("px", ""));
  return d3.scaleLinear().range([0, width - marginLeft - marginRight]);
}

export function GetYScale(containerID, domain, martinTop, marginBottom) {
  const height = parseInt(d3.select(containerID).style("height").replace("px", ""));
  return d3.scaleBand().domain(domain).rangeRound([0, height - martinTop - marginBottom])
    .paddingInner(0.05);
}
