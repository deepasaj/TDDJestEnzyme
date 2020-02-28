import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import BuildIcon from "@material-ui/icons/Build";
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
  },
}));

const InvMenu = (props) => {
  const { history } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.mainGrid}>
        <Grid item xs={5}>
          <MenuCard
            title="Before we can automate we need something to automate, so let's start by adding devices"
            cardIcon={
              <AddCircleIcon className={classes.icon} fontSize="large" />
            }
            handleBtn={() => history.push('/inventory/bulk')}
            btnText="Bulk Add Devices"
            isDisabled={false}
            height={180}
          />
        </Grid>
        <Grid item xs={5}>
          <MenuCard
            title="Need to view, update, delete, or add a few devices in your inventory? get your puppet master game on now"
            cardIcon={<BuildIcon className={classes.icon} fontSize="large" />}
            handleBtn={() => history.push('/inventory/manage')}
            btnText="Manage"
            isDisabled={false}
            height={180}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(InvMenu);
