import "./Readme.css";

import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
      <>
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
            <h1>Read Me!</h1>
          </div>
        </div>
      </>
    );
  }
}

export default Readme;
