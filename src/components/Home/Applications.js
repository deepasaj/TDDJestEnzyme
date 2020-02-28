import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AssignmentIcon from "@material-ui/icons/Assignment";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import TimelineIcon from '@material-ui/icons/Timeline';
import { withRouter } from 'react-router-dom';
import MenuCard from "./Card";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: "40px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  mainGrid: {
    justifyContent: "center"
  },
  cardContent: {
    textAlign: "center"
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
    textAlign: "center"
  },
  numberStyle: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#343a40"
  }
}));

const ApplicationTab = props => {
  const classes = useStyles();
  const { history } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.mainGrid}>
        <Grid item xs={6}>
          <MenuCard
            title="What devices you would like to integrate into the production
            network? Get started here by adding devices"
            cardIcon={
              <FormatListBulletedIcon
                className={classes.icon}
                fontSize="large"
              />
            }
            handleBtn={() => history.push('/inventory')}
            btnText="Inventory"
            isDisabled={false}
            height={175}
          />
        </Grid>
        <Grid item xs={6}>
          <MenuCard
            title="Take action now and start configuring devices for T-Mobile's production network"
            cardIcon={
              <DoubleArrowIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/deploy')}
            btnText="Deployments"
            isDisabled={false}
            height={175}
          />
        </Grid>
        <Grid item xs={6}>
          <MenuCard
            title="Check your jobs, their status, and their individual tasks status here"
            cardIcon={
              <AssignmentIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/job')}
            btnText="Jobs"
            isDisabled={false}
            height={160}
          />
        </Grid>
        <Grid item xs={6}>
          <MenuCard
            title="View metrics about jobs, deployment groups, and users here"
            cardIcon={
              <TimelineIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/dashboard')}
            btnText="Dashboard"
            isDisabled={false}
            height={160}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(ApplicationTab);
