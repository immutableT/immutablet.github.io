const color = d3.scaleQuantize()
  .range([
    "rgb(14,63,153)",
    "rgb(73,93,154)",
    "rgb(155,163,193)",
    "rgb(206,136,125)",
    "rgb(196,58,31)"]
  );

let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);
let tooltip = d3.select('#tooltip-map');

function attachScore(data, year, geojson) {
  for (let i = 0; i < data.length; i++) {
    let dataCountry = data[i].Country;
    let score = parseFloat(data[i][year]);
    // console.log(`${dataCountry} ${score}`)

    for (let j = 0; j < geojson.features.length; j++) {
      if (dataCountry === geojson.features[j].properties.name) {
        geojson.features[j].properties.value = score;
        // console.log(`Matched ${dataCountry}`)
        break;
      }
    }
  }
}

function setColorDomain(data, year) {
  let min = d3.min(data, function(d) { return d[year]; });
  let max = d3.max(data, function(d) { return d[year]; });
  color.domain([min, max]);
}

function setFill(data) {
  let score = data.properties.value;
  if (score) {
    // console.log(`Found score of ${score} for ${d.properties.name}`)
    return color(score);
  } else {
    //If value is undefined…
    return "#ccc";
  }
}

function attachTooltip(d) {
  tooltip
    .style('left', d.clientX + 'px')
    .style('top', d.clientY + 'px')

  let country = d3.select(this).data()[0].properties.name
  let msg = `${country}: `
  let score = d3.select(this).data()[0].properties.value
  if (!score) {
    msg = `${msg}: data unavailable`
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(msg)
    return;
  }

  msg = `${msg}${score}`

  let year = eval(d3.select("#year").property('value'));
  let previousYear = (parseInt(year) - 1).toString();
  console.log(`Getting delta for country: ${country}, year: ${year} previousYear: ${previousYear}`);

  d3.csv('./data/overall.csv').then(function (data) {
    data = data.filter(function (row) {
      return row['Country'] === country;
    });
    let delta = (parseFloat(data[0][year]) - parseFloat(data[0][previousYear])).toPrecision(1);
    msg = `${msg}<br/>Change from ${previousYear}: `
    if (delta > 0) {
      msg = `${msg}<span class="more-peaceful">+${delta}</span>`
    } else {
      msg = `${msg}<span class="less-peaceful">${delta}</span>`
    }

    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(msg)
      .style('left', d.clientX + 'px')
      .style('top', d.clientY + 'px')
  })
}

function getZoom(svg) {
  let zooming = function (event, _) {
    let offset = [event.transform.x, event.transform.y];
    let newScale = event.transform.k * 2000;
    projection.translate(offset).scale(newScale);
    svg.selectAll("path").attr("d", path);
  }
  return d3.zoom().scaleExtent([0.05, 2.0]).on("zoom", zooming);
}

export function CreateGPIMap(container, year) {
  let svg = d3.select(container);
  const width = parseInt(svg.style("width").replace("px", ""));
  const height = parseInt(svg.style("height").replace("px", ""));
  let zoom = getZoom(svg);

  svg
    .call(zoom)
    .call(zoom.transform, d3.zoomIdentity
      .translate(width/2, height/1.5)
      .scale(0.06));

  console.log(`Generating map for year ${year}`);
  d3.csv("data/overall.csv").then(function(data) {
    setColorDomain(data, year)

    d3.json("data/world.geo.json").then(function(geojson) {
      attachScore(data, year, geojson);
      svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", setFill)
        .on("mouseover", attachTooltip)
        .on("mouseout", function() {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        })
    });
  });
}

export function UpdateGPIMap(container, year) {
  let svg = d3.select(container);
  console.log(`Generating update for year ${year}`);
  d3.csv("data/overall.csv").then(function(data) {
    setColorDomain(data, year)

    d3.json("data/world.geo.json").then(function(geojson) {
      attachScore(data, year, geojson);
      svg.selectAll("path")
        .data(geojson.features)
        .transition()
        .style("fill", setFill)
    });
  });
}

export function CreateZoomButtons(container) {
  let svg = d3.select(container);
  let zoomIn = d3.select("#zoom-in");
  let zoomOut = d3.select("#zoom-out");

  zoomIn.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 30);

  zoomIn.append("text")
    .attr("x", 15)
    .attr("y", 20)
    .text("+");

  zoomOut.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", 30);

  zoomOut.append("text")
    .attr("x", 15)
    .attr("y", 20)
    .html("&ndash;");

  d3.selectAll(".zoom")
    .on("click", function() {
      let scaleFactor;
      let direction = d3.select(this).attr("id");

      switch (direction) {
        case "zoom-in":
          scaleFactor = 1.5;
          break;
        case "zoom-out":
          scaleFactor = 0.75;
          break;
        default:
          break;
      }

      let zoom = getZoom(svg);
      svg.transition()
        .call(zoom.scaleBy, scaleFactor);
    });

}






