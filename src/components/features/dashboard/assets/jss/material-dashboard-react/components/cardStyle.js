import {
  blackColor,
  hexToRgb
} from "../../material-dashboard-react.js";

const cardStyle = {
  card: {
    border: "0",
    marginBottom: "20px",
    marginTop: "20px",
    borderRadius: "6px",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.87)",
    background: "#FFF",
    opacity: "0.95",
    width: "100%",
    boxShadow: "0 1px 4px 0 rgba(" + hexToRgb(blackColor) + ", 0.14)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    minHeight:"130px",
    wordWrap: "break-word",
    fontSize: "50px"
  },
  piecard: {
    minWidth: "480px"
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardProfile: {
    marginTop: "30px",
    textAlign: "center"
  },
  cardChart: {
    "& p": {
      marginTop: "0px",
      paddingTop: "0px"
    }
  }
};

export default cardStyle;