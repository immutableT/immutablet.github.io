export class Barchart {
  #containerID;
  #marginLeft;
  #marginRight;
  #marginTop;
  #marginBottom;
  #xScale;
  #yScale;
  #xAxis;
  #yAxis;
  #width;
  #height;
  #year;
  #previousYear;
  #data;
  #domain;

  constructor(containerID, marginLeft, marginRight, marginTop, marginBottom, domain, year, data) {
    this.#containerID = containerID;
    this.#marginLeft = marginLeft;
    this.#marginRight = marginRight;
    this.#marginTop = marginTop;
    this.#marginBottom = marginBottom;
    this.#domain = domain;
    this.#year = year;
    this.#previousYear = (parseInt(year) - 1).toString();
    this.#width = parseInt(d3.select(containerID).style("width").replace("px", ""));
    this.#height = parseInt(d3.select(containerID).style("height").replace("px", ""));
    this.#data = data;

    this.#xScale = d3.scaleLinear().range([0, this.#width - marginLeft - marginRight]);
    this.#yScale = d3.scaleBand()
      .domain(domain)
      .rangeRound([0, this.#height - this.#marginTop - this.#marginBottom])
      .paddingInner(0.05);
    this.#xAxis = d3.axisBottom(this.#xScale);
    this.#yAxis = d3.axisLeft(this.#yScale).tickSize(0).tickPadding(6);

    let pYear = this.#previousYear;
    this.#xScale.domain(d3.extent(
      data, function(d) {
        let yearVal = parseFloat(d[year])
        let prevYearVal = parseFloat(d[pYear]);
        return yearVal - prevYearVal;
      })).nice();

  }

  get XAxis() {
    return this.#xAxis;
  }

  get YAxis() {
    return this.#yAxis;
  }

  get XAxisTranslation() {
    return `translate(0,${this.#yScale.range()[1]})`
  }

  get YAxisTranslation() {
    return `translate(${this.#xScale(0)},0)`
  }

  get XScale() {
    return this.#xScale;
  }

  get YScale() {
    return this.#yScale;
  }

  #getDelta(d) {
    let yearVal = parseFloat(d[this.#year])
    let prevYearVal = parseFloat(d[this.#previousYear]);
    return yearVal - prevYearVal;
  }

  GetBarX(d) {
    return this.#xScale(Math.min(0, this.#getDelta(d, this.#year, this.#previousYear)));
  }

  GetBarWidth(d) {
    let delta = this.#getDelta(d);
    let scale = this.#xScale(delta);
    return Math.abs(scale - this.#xScale(0));
  }

  GetStyle(d) {
    if (this.#getDelta(d) > 0) {
      return "positive";
    }

    return "negative"
  }
}

