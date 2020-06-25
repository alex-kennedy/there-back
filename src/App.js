import "./App.css";

import React from "react";
import { createViz, VizData } from "./viz";
import locations from "./data/loc_payload.json";
import commuters from "./data/commuters.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedNode: null, outbound: true, hoverNode: null };
    this.vizData = new VizData(locations, commuters);
  }

  componentDidMount() {
    createViz(this.vizData, this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-container"></div>
        <div className="App-test-div" style={{ position: "absolute", top: 0 }}>
          <p>
            {this.state.selectedNode === null
              ? "Nothing"
              : this.vizData.locs[this.state.selectedNode].name}{" "}
            is selected.
          </p>
          <p>
            {this.state.hoverNode === null
              ? "Nothing"
              : this.vizData.locs[this.state.hoverNode].name}{" "}
            is hovered.
          </p>
          <p>Outbound = {String(this.state.outbound)}.</p>
        </div>
      </div>
    );
  }
}

export default App;
