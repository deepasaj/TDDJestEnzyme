import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAuthAPI } from 'store/store';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles(() => ({
  devices: {
    width: '600px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  paper: {
    padding: 50,
  },
  circularProgress: {
    marginTop: 25,
  },
  button: {
    marginTop: 25,
  },
}));

const ValidationRequest = () => {
  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [devices, setDevices] = useState();
  const authAPI = useAuthAPI();
  const [postJobInProgress, setPostJobInProgress] = useState(false);

  const toUpper = (val) => val.toUpperCase();

  const handleOnChange = (e) => {
    if (typeof e.target.value === 'string') {
      const deviceArray = e.target.value.split(',');
      setDevices(deviceArray.map(toUpper));
    }
  };

  // kick off job creation orchestration
  // called in JobConfirmationModal
  const postJob = async () => {
    setPostJobInProgress(true);
    const userSelections = devices.map((device) => ({
      workflow: 'DA Validation',
      hostname: device.trim(),
    }));
    const jobCreationBody = { data: { user_selections: userSelections, status: 'Ready' } };

    try {
      const { data } = await authAPI.post('/workflow/report_job_create', jobCreationBody);
      const jobId = data.data.job_id;
      await authAPI.post(`/workflow/start-orchestration/${jobId}`);

      setPostJobInProgress(false);

      history.push('/workflow/job');
    } catch (err) {
      setPostJobInProgress(false);
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    }
  };

  return (
    <>
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
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            {
            postJobInProgress ? (
              <CircularProgress className={classes.circularProgress} />
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
    </>
  );
};

export default ValidationRequest;
