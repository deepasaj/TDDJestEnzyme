import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(() => ({
  cardContent: {
    height: props => props.height,
  },
  cardActions: {
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderTop: "1px solid #ededed"

  },
  actionBtn: {
    paddingLeft: "30px",
    paddingRight: "30px",
    margin: "5px",
    width: "100%"
  },
  icon: {
    fontSize: "70px",
    margin: "7px "
  },
  textStyle: {
    fontSize: "16px",
    fontWeight: "450",
    borderTop: "1px solid #ededed",
    paddingTop: "10px",
    textAlign: "center",
  },
  numberStyle: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#343a40",
    textAlign: "center"
  },
  card: {
     cursor: "pointer",
     '&:hover': {
      boxShadow: '0px 5px 5px -3px rgba(0, 123, 255,0.2), 0px 8px 10px 1px rgba(0, 123, 255,0.14), 0px 3px 14px 2px rgba(0, 123, 255,0.12)',
      transform: "scale(1.01)"
    }
  }
}));

const StatsCard = props => {
  const { text, num, handleQuickLink } = props;
  const classes = useStyles(props);

  return (
    <Link
      onClick={handleQuickLink}
    >
        <Card className={classes.card} raised>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.numberStyle}>{num}</Typography>
            <Typography className={classes.textStyle}>{text}</Typography>
          </CardContent>
        </Card>
    </Link>
  );
};

export default StatsCard;
