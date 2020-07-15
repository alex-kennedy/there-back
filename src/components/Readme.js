import "./Readme.css";

import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import blue from "@material-ui/core/colors/blue";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: blue[500] },
  },
});

class Readme extends React.Component {
  constructor(props) {
    super(props);
    this.state = { closed: true };
  }

  componentDidMount() {
    document.addEventListener("keydown", (ev) => {
      if (ev.keyCode === 27 && !this.state.closed) {
        this.setState({ closed: true });
      }
    });
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <div
          className="Readme-closed"
          style={{ display: this.state.closed ? "block" : "none" }}
        >
          <IconButton
            aria-label="readme"
            className="Readme-open-button"
            onClick={() => this.setState({ closed: false })}
          >
            <InfoIcon fontSize="large" />
          </IconButton>
        </div>
        <div
          className={
            this.state.closed
              ? "Readme-container"
              : "Readme-container Readme-container-opened"
          }
        >
          <IconButton
            aria-label="close-readme"
            className="Readme-open-button"
            onClick={() => this.setState({ closed: true })}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <div className="Readme-content">
            <Typography variant="h2" color="textPrimary">
              How New Zealanders Commute
            </Typography>
            <div style={{ height: "16px" }}></div>
            <Button
              variant="outlined"
              href="https://github.com/alex-kennedy/there-back"
            >
              View on GitHub
            </Button>
            <div style={{ height: "16px" }}></div>
            <Typography variant="subtitle" color="textSecondary">
              This project is a visualisation of the{" "}
              <Link href="https://datafinder.stats.govt.nz/data/category/census/2018/commuter-view/">
                commuter data
              </Link>{" "}
              from the 2018 New Zealand Census.
            </Typography>
            <div style={{ paddingTop: "16px", paddingBottom: "32px" }}></div>
            <Typography variant="h4" color="textPrimary">
              The Project
            </Typography>
            <Typography variant="body1" color="textPrimary">
              One of the problems I see with map-based visualisations is they
              look too dense in high population areas. In this visualisation, I
              aimed to represent the geography a little more loosely by using a
              cartogram approach. Each statistical area is represented by one
              point, and I used a custom algorithm to place them on the map near
              to their actual location. This means each hexagon represents a
              similar size population, helping to reduce this density problem.{" "}
            </Typography>
            <div style={{ height: "16px" }}></div>
            <Typography variant="body1" color="textPrimary">
              Clicking on one of the locations shows a heat map of the number of
              people who commute from that location <i>out</i> to other
              locations. Clicking again reverses the flow, and a heat map of the
              number commuters <i>into</i> that location is shown. A table shows
              more detailed information. The heat map allows you to click
              through the darker spots on the map, giving the sense of the
              commuting chain/network which takes place each day in New Zealand.{" "}
            </Typography>
            <div style={{ height: "16px" }}></div>
            <Typography variant="body1" color="textPrimary">
              This visualisation is custom built in the 'd3' graphing framework,
              with the UI built in React. I used a hexagonal grid because I
              think it feels more connected. Each hexagon was placed on the map
              in a location such that the total squared difference of each
              hexagon to its correct geographic location (statistical area
              centroid) is minimised (an example of the Assignment Problem).{" "}
            </Typography>
            <div style={{ height: "16px" }}></div>
            <Typography variant="body1" color="textPrimary">
              The only dataset used is the NZ Census 2018 Commuter View Data,
              which includes the locations of each statistical area.{" "}
            </Typography>
            <div style={{ height: "32px" }}></div>
            <Typography variant="body1" color="textSecondary">
              This project was completed by Alex Kennedy (
              <Link href="https://alexk.nz">alexk.nz</Link>) for the{" "}
              <Link href="https://www.stats.govt.nz/2018-census/there-and-back-again-data-visualisation-competition/">
                "There and Back Again"
              </Link>{" "}
              data visualisation competition by Stats NZ.
            </Typography>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default Readme;
