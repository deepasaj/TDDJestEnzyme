import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(() => ({
  card: {
    cursor: "pointer",
     '&:hover': {
      boxShadow: '0px 5px 5px -3px rgba(0, 123, 255,0.2), 0px 8px 10px 1px rgba(0, 123, 255,0.14), 0px 3px 14px 2px rgba(0, 123, 255,0.12)',
      transform: "scale(1.01)"
    }
  },
  cardContent: {
    textAlign: "center",
    paddingBottom: "0px",
    height: props => props.height
  },
  cardActions: {
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderTop: "1px solid #ededed"
  },
  actionBtn: {
    justifyContent: "center",
    background: '#f5f5f5',
    '&:hover': {
      background: '#ebebeb',
      transform: "scale(1.01)"
    }
  },
  icon: {
    fontSize: "70px",
    margin: "7px "
  },
  textStyle: {
    fontSize: "16px",
    fontWeight: "450",
    textAlign: "center",
    paddingBottom: "10px",
  },
  btnText: {
    fontSize: "17px",
    fontWeight: "500",
    padding: "2px 0px 2px 0px"
  }
}));

const MenuCard = props => {
  const { title, cardIcon, handleBtn, btnText } = props;
  const classes = useStyles(props);

  return (
    <Link
        onClick={handleBtn}
    >
        <Card className={classes.card} raised>
          <CardContent className={classes.cardContent}>
            {cardIcon}
            <br />
            <Typography className={classes.textStyle}>{title}</Typography>
          </CardContent>
          <CardActions className={classes.actionBtn}>
            <Typography className={classes.btnText}>{btnText}</Typography>
          </CardActions>
        </Card>
    </Link>
  );
};

export default MenuCard;
