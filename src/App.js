import "./App.css";

import React from "react";
import * as d3 from "d3";
import { VizData, Hexagon } from "./viz";
import Readme from "./components/Readme";
import InfoPanel from "./components/InfoPanel";
import locations from "./data/loc_payload.json";
import commuters from "./data/commuters.json";
import tippy, { followCursor } from "tippy.js";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedNode: null, outbound: true, hoverNode: null };
    this.data = new VizData(locations, commuters);

    this.select = this.select.bind(this);
    this.deselect = this.deselect.bind(this);
  }

  componentDidMount() {
    window.data = this.data;
    this.createViz();
    this.createTooltip();
  }

  // Moves the visualization to the centre of the screen and sizes it according
  // to the window size
  resetPosition() {
    const bbox = this.container.node().getBBox();
    const scale =
      0.9 *
      Math.min(
        window.innerWidth / bbox.width,
        window.innerHeight / bbox.height
      );
    this.zoomBehaviour.scaleTo(this.svg, scale);
    this.zoomBehaviour.translateTo(this.svg, bbox.width / 2, bbox.height / 2);
  }

  // Creates the hexagons (main visualisation)
  createAndSetHexagons() {
    this.hexagons = this.container
      .selectAll(".hexagon")
      .data(Object.values(this.data.locs))
      .enter()
      .append("polygon")
      .attr("points", (d) => {
        const hex = new Hexagon(d.hex_x, d.hex_y);
        return hex
          .points(0.9)
          .map((point) => [point.x, point.y].join(","))
          .join(" ");
      })
      .classed("hexagon", true);
  }

  // Sets behaviour for zooming and panning
  createAndSetZoomBehaviour() {
    this.zoomBehaviour = d3
      .zoom()
      .scaleExtent([1, 50])
      .on("zoom", () => {
        this.container.attr("transform", d3.event.transform);
      });
    this.svg.call(this.zoomBehaviour);
  }

  clearSelectStyles() {
    this.hexagons
      .classed("hexagon-inactive", false)
      .classed("hexagon-selected", false)
      .attr("style", null);
  }

  deselect() {
    this.setState({ selectedNode: null, outbound: true });
    this.clearSelectStyles();
  }

  select(clickedData) {
    this.clearSelectStyles();

    // The value that outbound will be set to
    let newOutbound = true;

    // Reverse the commutes if it's already selected, otherwise select anew
    if (clickedData.id === this.state.selectedNode) {
      newOutbound = !this.state.outbound;
      this.setState((state) => ({
        outbound: !state.outbound,
      }));
    } else {
      this.setState({
        selectedNode: clickedData.id,
        outbound: true,
      });
    }

    const directedCommutes = newOutbound
      ? this.data.outbound
      : this.data.inbound;
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

    this.hexagons
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
  }

  createViz() {
    this.div = d3.select(".App-container");
    this.svg = this.div.append("svg").classed("App-svg-content", true);
    this.container = this.svg.append("g");

    this.createAndSetHexagons();
    this.createAndSetZoomBehaviour();
    this.resetPosition();

    // Events
    this.hexagons.on("mouseover", (d) => {
      this.setState({ hoverNode: d.id });
      this.tooltip.setContent(d.name);
      this.tooltip.show();
    });

    this.hexagons.on("mouseout", (d) => {
      this.setState({ hoverNode: null });
      this.tooltip.hide();
    });

    this.div.on("click", (d) => {
      this.deselect();
    });

    this.hexagons.on("click", (clickedData) => {
      d3.event.stopPropagation();
      this.select(clickedData);
    });
  }

  createTooltip() {
    this.tooltip = tippy(".App-container", {
      trigger: "manual",
      followCursor: true,
      plugins: [followCursor],
      duration: [500, 0],
      theme: "material"
    })[0];
  }

  render() {
    return (
      <div className="App">
        <div className="App-container"></div>
        <Readme />
        <InfoPanel
          outbound={this.state.outbound}
          selectedNode={this.state.selectedNode}
          data={this.data}
          deselect={this.deselect}
          select={this.select}
        />
      </div>
    );
  }
}

export default App;
