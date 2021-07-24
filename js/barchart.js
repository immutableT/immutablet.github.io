export function GetXScale(containerID, marginLeft, marginRight) {
  const width = parseInt(d3.select(containerID).style("width").replace("px", ""));
  return d3.scaleLinear().range([0, width - marginLeft - marginRight]);
}

export function GetYScale(containerID, domain, martinTop, marginBottom) {
  const height = parseInt(d3.select(containerID).style("height").replace("px", ""));
  return d3.scaleBand().domain(domain).rangeRound([0, height - martinTop - marginBottom])
    .paddingInner(0.05);
}

export function GetX(xScale, d, year, previousYear) {
  return xScale(Math.min(0, GetDelta(d, year, previousYear)));
}

export function GetWidth(xScale, d, year, previousYear) {
  return Math.abs(xScale(GetDelta(d, year, previousYear)) - xScale(0));
}

export function GetDelta(d, year, previousYear) {
  let yearVal = parseFloat(d[year])
  let prevYearVal = parseFloat(d[previousYear]);
  return yearVal - prevYearVal;
}

export function GetStyle(d, year, previousYear) {
  if (GetDelta(d, year, previousYear) > 0) {
    return "positive";
  }

  return "negative"
}
