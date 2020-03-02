import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
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
  const [workflow, setWorkflow] = useState("DA Validation"); // eslint-disable-line no-unused-vars
  const authAPI = useAuthAPI();

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
  const postJob = () => {
    var user_selections = { workflow, devices }
    const jobCreationBody = { "data": [{ "user_id": user.id, "user_selections": [user_selections], "status": "Ready" }] }

    let didTimeOut = false;
    let didTimeOut2 = false;
    let didTimeOut3 = false;

    //timeout for /dbase/job
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);
      authAPI.fetch(`/dbase/job`, {
        method: 'POST',
        body: JSON.stringify(jobCreationBody)
      }).then(response => response.json())
        .then((response) => {
          clearTimeout(timeout);
          if (!didTimeOut) {
            resolve(response);
            if (true) { // eslint-disable-line no-constant-condition
              console.log("successfully submitted Job, inside post to /report_job_create")
              var id = response.id;
              setJobID(id);
              const createJobInput = { "data": [{ "id": id }] }

              //timeout for /report_job_create
              // eslint-disable-next-line no-undef
              new Promise(function (resolve, reject) {

                const timeout2 = setTimeout(function () {
                  didTimeOut2 = true;
                  reject(new Error('Request timed out'));
                }, 5000);

                authAPI.fetch(`/report_job_create`, {
                  method: 'POST',
                  body: JSON.stringify(createJobInput)
                }).then(response => response.json())
                  .then(response => {
                    clearTimeout(timeout2);
                    if (!didTimeOut2) {
                      resolve(response);
                      if (true) { // eslint-disable-line no-constant-condition

                        //timeout for /orchestration/start-orchestration/${id}
                        // eslint-disable-next-line no-undef
                        new Promise(function (resolve, reject) {

                          const timeout3 = setTimeout(function () {
                            didTimeOut3 = true;
                            reject(new Error('Request timed out'));
                          }, 5000);

                          authAPI.fetch(`/orchestration/start-orchestration/${id}`, {
                            method: 'POST'
                          })
                            .then(() => {
                              clearTimeout(timeout3);
                              if (!didTimeOut3) {
                                resolve(response);
                                history.push('/job');
                              }
                            }).catch(() => {
                              showNotification("There was an error submitting the request for initial orchestration for this job to execute any prerequisites tasks. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                            });

                        })
                          .then(function () {
                          })
                          .catch(function () {
                            // Error: response error, request timeout or runtime error
                            showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                          });

                      }
                    }

                  }).catch(() => {
                    showNotification("There was an error submitting the Deployment Request. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                  });

              })
                .then(function () {
                })
                .catch(function () {
                  // Error: response error, request timeout or runtime error
                  showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
                });
            }
          }
        }).catch(() => {
          showNotification("There was an error submitting the Deployment Request. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function (err) {
        // Error: response error, request timeout or runtime error
        console.log(err)
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={postJob}
          >
            Submit
          </Button>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default withRouter(ValidationRequest);
