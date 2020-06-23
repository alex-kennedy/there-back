import * as d3 from "d3";

import MainColourScale from "./colors";

class VizData {
  constructor(locs, outbound) {
    this.locs = locs;
    this.outbound = outbound;
    this.inbound = this.reverseCommutes(outbound);
    this.addNameToLocs();
    this.addSizeToLocs();
  }

  reverseCommutes(outbound) {
    const inbound = {};
    for (let [from, toLocations] of Object.entries(outbound)) {
      for (let [to, data] of Object.entries(toLocations)) {
        inbound[to] = inbound[to] || {};
        inbound[to][from] = data;
      }
    }
    return inbound;
  }

  addNameToLocs() {
    for (let [name, d] of Object.entries(this.locs)) {
      d["name"] = name;
    }
  }

  // Adds a size measure (log of total outbound commuting) to the locations.
  addSizeToLocs() {
    for (const origin in this.locs) {
      let total = 1; // Makes sure we can take the log
      if (origin in this.outbound) {
        for (const name in this.outbound[origin]) {
          if (!isNaN(this.outbound[origin][name].work)) {
            total += this.outbound[origin][name].work;
          }
          if (!isNaN(this.outbound[origin][name].edu)) {
            total += this.outbound[origin][name].edu;
          }
        }
      }
      this.locs[origin]["size"] = Math.log(total);
    }
  }
}

class Hexagon {
  constructor(hex_x, hex_y) {
    this.hex_x = hex_x;
    this.hex_y = hex_y;

    this.x = this.hex_x + 2;
    this.y = (this.hex_y * 3) / Math.sqrt(3) + 2;
  }

  points(width) {
    const height = (Math.sqrt(3) * width) / 3;
    return [
      { x: this.x + width, y: this.y + height },
      { x: this.x, y: this.y + 2 * height },
      { x: this.x - width, y: this.y + height },
      { x: this.x - width, y: this.y - height },
      { x: this.x, y: this.y - 2 * height },
      { x: this.x + width, y: this.y - height },
    ];
  }
}

function createViz(data) {
  // Creates a color scale for hexagon size
  let maxSize = 0;
  for (const name in data.locs) {
    if (data.locs[name].size > maxSize) {
      maxSize = data.locs[name].size;
    }
  }
  const colourScale = new MainColourScale(0, maxSize);

  // The main containing components
  const div = d3.select(".App-container");
  const svg = div.append("svg").classed("App-svg-content", true);
  const container = svg.append("g");

  // Creates the hexagons (main visualisation)
  const hexagons = container
    .selectAll("#hexagon")
    .data(Object.values(data.locs))
    .enter()
    .append("polygon")
    .attr("points", (d) => {
      const hex = new Hexagon(d.hex_x, d.hex_y);
      return hex
        .points(0.8)
        .map((point) => [point.x, point.y].join(","))
        .join(" ");
    })
    .attr("fill", (d) => {
      return colourScale.get(d.size);
    })
    .classed("hexagon", true);

  // Sets behaviour for zooming and panning
  const zoomBehaviour = d3
    .zoom()
    .scaleExtent([1, 50])
    .on("zoom", () => {
      container.attr("transform", d3.event.transform);
    });
  svg.call(zoomBehaviour);

  // Moves the visualization to the centre of the screen and sizes it according
  // to the window size
  const resetPosition = () => {
    const bbox = container.node().getBBox();
    const scale =
      0.9 *
      Math.min(
        window.innerWidth / bbox.width,
        window.innerHeight / bbox.height
      );
    zoomBehaviour.scaleTo(svg, scale);
    zoomBehaviour.translateTo(svg, bbox.width / 2, bbox.height / 2);
  };
  resetPosition();
}

export { createViz, VizData };
