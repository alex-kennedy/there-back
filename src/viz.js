import * as d3 from "d3";

class VizData {
  constructor(locs, outbound) {
    this.locs = locs;
    this.outbound = outbound;
    this.addIDToLocs();
    this.addSizeToLocs();
    this.inbound = this.reverseCommutes(outbound);
    this.addIDToCommutes();
  }

  reverseCommutes(outbound) {
    const inbound = {};
    for (let [from, toLocations] of Object.entries(outbound)) {
      for (let [to, data] of Object.entries(toLocations)) {
        inbound[to] = inbound[to] || {};
        inbound[to][from] = Object.assign({}, data);;
      }
    }
    return inbound;
  }

  addIDToLocs() {
    for (let [id, d] of Object.entries(this.locs)) {
      d["id"] = id;
    }
  }

  addIDToCommutes() {
    for (const commutes of [this.inbound, this.outbound]) {
      for (const a of Object.keys(commutes)) {
        for (const b of Object.keys(commutes[a])) {
          commutes[a][b].id = b;
        }
      }
    }
  }

  // Adds a size measure (log of total outbound commuting) to the locations.
  addSizeToLocs() {
    for (const origin in this.locs) {
      let total = 1; // Makes sure we can take the log
      if (origin in this.outbound) {
        for (const id in this.outbound[origin]) {
          if (!isNaN(this.outbound[origin][id].work)) {
            total += this.outbound[origin][id].work;
          }
          if (!isNaN(this.outbound[origin][id].edu)) {
            total += this.outbound[origin][id].edu;
          }
        }
      }
      this.locs[origin]["size"] = total;
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

function createViz(data, app) {
  // The main containing components
  const div = d3.select(".App-container");
  const svg = div.append("svg").classed("App-svg-content", true);
  const container = svg.append("g");

  // Creates the hexagons (main visualisation)
  const hexagons = container
    .selectAll(".hexagon")
    .data(Object.values(data.locs))
    .enter()
    .append("polygon")
    .attr("points", (d) => {
      const hex = new Hexagon(d.hex_x, d.hex_y);
      return hex
        .points(0.85)
        .map((point) => [point.x, point.y].join(","))
        .join(" ");
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

  // Events
  hexagons.on("mouseover", (d) => {
    app.setState({ hoverNode: d.id });
  });

  hexagons.on("mouseout", (d) => {
    app.setState({ hoverNode: null });
  });

  const deselectAll = () => {
    hexagons
      .classed("hexagon-inactive", false)
      .classed("hexagon-selected", false)
      .attr("style", null);
  };
  div.on("click", (d) => {
    app.setState({ selectedNode: null, outbound: true });
    deselectAll();
  });

  hexagons.on("click", (clickedData) => {
    // Stops the click reaching the parent div
    d3.event.stopPropagation();

    deselectAll();

    // The value that outbound will be set to
    let newOutbound = true;

    // Reverse the commutes if it's already selected, otherwise select anew
    if (clickedData.id === app.state.selectedNode) {
      newOutbound = !app.state.outbound;
      app.setState((state, props) => ({
        outbound: !state.outbound,
      }));
    } else {
      app.setState({
        selectedNode: clickedData.id,
        outbound: true,
      });
    }

    const directedCommutes = newOutbound ? data.outbound : data.inbound;
    const commutesForClickedNode = directedCommutes[clickedData.id] || {};

    // Calculates maximum number of commuters for colour mapping
    let maxCommuters = 0;
    for (const pairNodeID in commutesForClickedNode) {
      let count = 0;
      if ("work" in commutesForClickedNode[pairNodeID]) {
        count += commutesForClickedNode[pairNodeID].work;
      }
      if ("edu" in commutesForClickedNode[pairNodeID]) {
        count += commutesForClickedNode[pairNodeID].edu;
      }
      maxCommuters = Math.max(maxCommuters, count);
    }

    hexagons
      .classed("hexagon-inactive", (pairNode) => {
        return !(pairNode.id in commutesForClickedNode);
      })
      .classed("hexagon-selected", (node) => node.id === clickedData.id)
      .attr("style", (pairNode) => {
        if (!(pairNode.id in commutesForClickedNode)) {
          return null;
        }

        // Colour as a proportion of the maximum number of commuters
        let count = 0;
        if ("work" in commutesForClickedNode[pairNode.id]) {
          count += commutesForClickedNode[pairNode.id].work;
        }
        if ("edu" in commutesForClickedNode[pairNode.id]) {
          count += commutesForClickedNode[pairNode.id].edu;
        }
        return `fill:${d3.interpolateMagma(1 - count / maxCommuters)};`;
      });
  });
}

export { createViz, VizData, Hexagon };
