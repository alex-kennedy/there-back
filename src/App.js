import "./App.css";

import React from "react";
import { createViz, VizData } from "./viz";
import locations from "./data/loc_payload.json";
import commuters from "./data/commuters.json";

class App extends React.Component {
  componentDidMount() {
    const vizData = new VizData(locations, commuters);
    createViz(vizData);
  }

  render() {
    return (
      <div className="App">
        <div className="App-container"></div>
      </div>
    );
  }
}

export default App;
