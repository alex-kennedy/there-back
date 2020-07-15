import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 320,
    bottom: "16px",
    right: "16px",
    position: "absolute",
    maxHeight: "75%",
    zIndex: 2,
  },
  colorScaleContainer: {
    // height: "32px",
  },
  colorScaleImage: {
    width: "100%",
    height: "32px",
  },
  directionMarker: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  outbound: {
    transform: "rotate(-135deg)",
  },
  tableContent: {
    height: "250px",
    overflowX: "scroll",
  },
  tableRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#555",
    },
  },
}));

export default function InfoPanel(props) {
  const classes = useStyles();

  if (props.selectedNode === null) {
    return null;
  }

  const directedCommutesObject = (props.outbound
    ? props.data.outbound
    : props.data.inbound)[props.selectedNode];
  const directedCommutes = Object.values(directedCommutesObject);
  directedCommutes.sort((a, b) => {
    let aTotal = 0;
    aTotal += a.work || 0;
    aTotal += a.edu || 0;

    let bTotal = 0;
    bTotal += b.work || 0;
    bTotal += b.edu || 0;

    return bTotal - aTotal;
  });

  let maxCommuters = 0;
  for (const commute of directedCommutes) {
    let numCommuters = 0;
    numCommuters += commute.work || 0;
    numCommuters += commute.edu || 0;
    maxCommuters = Math.max(maxCommuters, numCommuters);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <ArrowForwardIcon
              className={clsx(classes.directionMarker, {
                [classes.outbound]: props.outbound,
              })}
            />
          }
          action={
            <IconButton aria-label="settings" onClick={props.deselect}>
              <CloseIcon />
            </IconButton>
          }
          title={props.outbound ? "Outbound From" : "Inbound To"}
          subheader={props.data.locs[props.selectedNode].name}
          titleTypographyProps={{ color: "textSecondary" }}
          subheaderTypographyProps={{ color: "textPrimary" }}
        />
        <CardMedia className={classes.colorScaleContainer}>
          <img
            className={classes.colorScaleImage}
            src={process.env.PUBLIC_URL + "/magma.png"}
            alt="Magma colour scale"
          />
          <div
            style={{
              width: "50%",
              display: "inline-block",
              paddingLeft: "8px",
              boxSizing: "border-box"
            }}
          >
            0
          </div>
          <div
            style={{
              width: "50%",
              display: "inline-block",
              textAlign: "right",
              paddingRight: "8px",
              boxSizing: "border-box"
            }}
          >
            {maxCommuters}
          </div>
        </CardMedia>
        <CardMedia className={classes.tableContent}>
          <TableContainer>
            <Table
              className={classes.table}
              size="small"
              aria-label="commuters data table"
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Work</TableCell>
                  <TableCell align="right">Education</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {directedCommutes.map((commute) => {
                  const work = commute.work || 0;
                  const edu = commute.edu || 0;
                  return (
                    <TableRow
                      key={commute.id}
                      onClick={() => {
                        props.select(props.data.locs[commute.id]);
                      }}
                      className={classes.tableRow}
                    >
                      <TableCell component="th" scope="row">
                        {props.data.locs[commute.id].name}
                      </TableCell>
                      <TableCell align="right">{work}</TableCell>
                      <TableCell align="right">{edu}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardMedia>
      </Card>
    </ThemeProvider>
  );
}
