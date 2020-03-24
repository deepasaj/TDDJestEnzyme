import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { withRouter } from 'react-router-dom';
import { useAuthAPI } from 'store/store';

const useStyles = makeStyles(() => ({
  devices: {
    width: "600px",
    marginRight: "auto",
    marginLeft: "auto"
  },
  paper: {
    padding: 50
  },
  circularProgress: {
    marginTop: 25
  },
  button: {
    marginTop: 25
  }
}));

const ValidationRequest = (props) => {
  const { history } = props;
  const classes = useStyles();
  const [state] = useStateValue();
  const { user } = state;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [devices, setDevices] = useState();
  const [jobId, setJobID] = useState(-1); // eslint-disable-line no-unused-vars
  const authAPI = useAuthAPI();
  const [postJobInProgress, setPostJobInProgress] = useState(false)

  const toUpper = (val) => {
    return val.toUpperCase();
  };

  const handleOnChange = e => {
    if (typeof e.target.value === 'string') {
      var device_array = e.target.value.split(',')
      setDevices(device_array.map(toUpper));
    }
  }

  //kick off job creation orchestration
  //called in JobConfirmationModal.js
  const postJob = async () => {
    setPostJobInProgress(true)
    const userSelections = devices.map(device => ({
      workflow: "DA Validation",
      hostname: device.trim()
    }))
    const jobCreationBody = { "data": [{ "user_id": user.id, "user_selections": userSelections, "status": "Ready" }] }

    try {
      const { data: job } = await authAPI.post(`/dbase/job`, jobCreationBody)
      console.log("successfully submitted Job, inside post to /report_job_create")
      var jobId = job.id;
      setJobID(jobId);
      const createJobInput = { "data": [{ "id": jobId }] }

      await authAPI.post(`/report_job_create`, createJobInput)
      await authAPI.post(`/orchestration/start-orchestration/${jobId}`)

      setPostJobInProgress(false)

      history.push('/job');
    } catch (err) {
      setPostJobInProgress(false)
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
    }
  }

  return (
    <React.Fragment>
      <Grid container>
        <Paper className={classes.paper}>
        <Grid item xs={12}>
          <h4>Device Report Request</h4>
          <p>Enter a list of comma separated device hostnames.</p>
          <FormControl>
            <TextField
              className={classes.devices}
              id="filled-multiline"
              label="Device(s)"
              multiline
              placeholder="LBZPOL70, ASAPOL88"
              variant="filled"
              onChange={handleOnChange}
            />
          </FormControl>
          </Grid>
          <Grid item xs={12} style={{ textAlign: "right"}} >
          {
            postJobInProgress ? (
              <CircularProgress className={classes.circularProgress}/>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={postJob}
              >
                Submit
              </Button>
            )
          }
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default withRouter(ValidationRequest);
