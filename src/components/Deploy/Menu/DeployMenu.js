import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ListIcon from "@material-ui/icons/List";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import { withRouter } from 'react-router-dom';
import MenuCard from "./Card";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  mainGrid: {
    justifyContent: "center"
  },
  icon: {
    fontSize: "70px",
    margin: "7px "
  }
}));

const DeployMenu = (props) => {
  const classes = useStyles();
  const { history } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.mainGrid}>
        <Grid item xs={4}>
          <MenuCard
            title="Start your deployment here by grouping the devices you want to work with"
            cardIcon={
              <DeviceHubIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/deploy/group/create')}
            btnText="Create Deployment Group"
            isDisabled={false}
            height={190}
          />
        </Grid>
        <Grid item xs={4}>
          <MenuCard
            title="View the deployment groups that have been created and begin a deployment request"
            cardIcon={<ListIcon className={classes.icon} fontSize="large" />}
            handleBtn={() => history.push('/deploy/deployment_groups')}
            btnText="Deployment Groups"
            isDisabled={false}
            height={190}
          />
        </Grid>
        <Grid item xs={4}>
          <MenuCard
            title="Check your jobs, their status, and their individual tasks status here"
            cardIcon={
              <AssignmentIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/job')}
            btnText="Jobs"
            isDisabled={false}
            height={190}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(DeployMenu);
