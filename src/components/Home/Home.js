import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import StatsCard from "./StatsCard";
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';

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
    paddingTop: "10px"
  },
  numberStyle: {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#343a40"
  }
}));

const HomeTab = props => {
  const { history } = props;
  const classes = useStyles();
  const [state] = useStateValue();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [activeJobs, setActiveJobs] = React.useState(0);
  const [completedJobs, setCompletedJobs] = React.useState(0);
  const [invDevices, setInvDevices] = React.useState(0);
  const [deployGroups, setDeployGroups] = React.useState(0);
  const authAPI = useAuthAPI();

  useEffect(() => {
    console.log('using effect')
    authAPI.get(`/home/active_jobs`, { timeout:5000 })
        .then((data) => {
            const rows = data.data.data[0];
            var count = rows['count(*)'];
            setActiveJobs(count);
        })
        .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
     authAPI.get(`/home/completed_jobs`, { timeout:5000 })
        .then((data) => {
            const rows = data.data.data[0];
            var count = rows['count(*)'];
            setCompletedJobs(count);
        })
        .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
     authAPI.get(`/dbase/inventory`, { timeout:5000 })
        .then((data) => {
            const rows = data.data.data.length;
            setInvDevices(rows);
        })
        .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
     authAPI.get(`/dbase/deployment_group`, { timeout:5000 })
        .then((data) => {
            const rows = data.data.data.length;
            setDeployGroups(rows);
        })
        .catch(() => {
            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });
    }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.mainGrid}>
        <Grid item xs={3}>
          <StatsCard
            num={invDevices} text="Devices in Inventory" 
            handleQuickLink={() => history.push('/inventory/manage')}
          />
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            num={deployGroups} text="Deployment Groups"
            handleQuickLink={() => history.push('/deploy/deployment_groups')}
          />
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            num={activeJobs} text="Active Jobs"
            handleQuickLink={() => history.push('/job?job_status=Active')}
          />
        </Grid>
        <Grid item xs={3}>
          <StatsCard
            num={completedJobs} text="Completed Jobs"
            handleQuickLink={() => history.push('/job?job_status=Complete')}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withRouter(HomeTab);
