import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import { API_URL } from 'config';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { getAuthHeader } from 'utils/auth';
import { useAuthAPI } from 'store/auth-store';

const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: "10px 25px 10px 25px",
  },
  btn_secondary: {
    marginTop: "10px 0px 10px 0px",
    marginLeft: "23px",
    backgroundColor: '#dc3545',
  },
  actions: {
    display: "block",
    textAlign: "center"
  },
  content: {
    display: "grid",
    width: "450px"
  },
  textField: {
    width: "250px",
    margin: "auto"
  }
}));

const TitlePopUp = props => {
  const classes = useStyles();
  const [state] = useStateValue();
  const { user } = state;
  const { history, showSetTitle, selectedRows, displayData, setGroupId, setShowSetTitle } = props;
  const [title, setTitle] = React.useState("");
  const [selectedDevices, setSelectedDevices] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authAPI = useAuthAPI();

  //set title state every time a change to the field occurs
  const handleChange = (e) => {
    setTitle(e.target.value);
  }

  //close TitleDialog.js
  const cancelCreation = () => {
    setShowSetTitle(false);
  }

  //create array containing device ids as seen in the db based on selectedRows
  //selectedRows is a prop created by mui-Datatables
  const changePage = () => {
    const values = selectedRows.data.map(
        row => displayData[row.index].data[0]
    );
    setSelectedDevices(values);
  }

  useEffect(() => {
    if (selectedDevices.length > 0) {
      postDeploymentGroup();
    }
  }, [selectedDevices]);

  //post deployment group to db
  //using back_populate endpoint to use relationships connecting deployment_group table to inventory table
  const postDeploymentGroup = () => {
    const body = { "data": [{ "devices": selectedDevices, "user_id": user.id, "name": title }] }

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`${API_URL}/dbase/back_populate/deploy`,{
        method:"POST",
        body: JSON.stringify(body)
      })
      .then(response=>response.json())
      .then(response => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
          setGroupId(response.id)
          groupCreated()
        }
      })
      .catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      })

    })
    .then(function () {
    })
    .catch(function () {
      // Error: response error, request timeout or runtime error
      showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
    });

  }

  //if group successfully created, redirect to deployment groups
  const groupCreated = () => {
    history.push('/deploy/deployment_groups');
  }

  return (
    <Dialog
      open={showSetTitle}
      aria-labelledby="form-dialog-title"
      className={classes.dialog}
    >
      <DialogContent dividers className={classes.content}>
        <div> Please title your deployment group before proceeding. Click <b>Create and Continue</b> to create the group or <b> Cancel </b> to make changes. </div>
        <TextField
          id="standard-name"
          label="Title"
          className={classes.textField}
          onChange={e => handleChange(e)}
          margin="normal"
          inputProps={{ maxLength: 15 }}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={cancelCreation}
            className={classes.btn_secondary}
          >
            Cancel
      </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={changePage}
            className={classes.btn_primary}
          >
            Create and Continue
      </Button>

        </div>
      </DialogActions>
    </Dialog>
  );
};

export default withRouter(TitlePopUp);
