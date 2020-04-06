import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import InventoryHomeCards from 'components/features/inventory/InventoryHomeCards'
import WorkflowHomeCards from 'components/features/workflow/WorkflowHomeCards'
import DashboardHomeCards from 'components/features/dashboard/DashboardHomeCards'

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

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.mainGrid}>
        <InventoryHomeCards classes={classes} />
        <WorkflowHomeCards classes={classes} />
        <DashboardHomeCards classes={classes} />
      </Grid>
    </div>
  );
};

export default ApplicationTab;
