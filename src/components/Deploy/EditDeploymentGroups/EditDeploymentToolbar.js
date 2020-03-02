import _ from "lodash";
import React, { useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { withRouter } from 'react-router-dom';
import { useAuthAPI } from 'store/store';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: "24px",
  },
  textField: {
    margin: "0px"
  }
}));

const CustomToolbarSelect = (props) => {
  const { history, groupId, selectedRows, displayData, currentTitle, setCurrentTitle } = props;
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedDevices, setSelectedDevices] = React.useState([]);
  const authAPI = useAuthAPI();

  const handleSaveDeploymentGroup = () => {
    // selectedRows is the dataIndex value
    const selectedRowDataIndexes = selectedRows.data.map( x => x.dataIndex)
    const selectedDeviceObjects = displayData.filter( x=> selectedRowDataIndexes.includes(x.dataIndex));
    const deviceIds = selectedDeviceObjects.map(x => x.data[0]);
    const deviceNames = _.join(selectedDeviceObjects.map(x => x.data[1]), ", ");
    console.log(`Saving: ${deviceNames}`)
    setSelectedDevices(deviceIds);
  };

  useEffect(() => {
    if (!_.isEmpty(selectedDevices)) {
      patchDeploymentGroup();
    }
  }, [selectedDevices]);

  //patch a deployment group if save button is clicked, take newly selected devices and update
  //relationship values
  const patchDeploymentGroup = () => {
    var postData = { "devices": selectedDevices, "name": currentTitle };

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/dbase/back_populate/deploy/id:${groupId}`, {
        body: JSON.stringify(postData),
        method: 'PATCH'
      }).then(response => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
          history.push('/deploy/deployment_groups');
        }
      })
        .catch(() => {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        });

    })
      .then(function () {
      })
      .catch(function () {
        // Error: response error, request timeout or runtime error
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });

  }

  //redirect back to deployment group table without editing
  const handleCancelEdit = () => {
    history.push('/deploy/deployment_groups');
  }

  //track changes to title field
  const handleChange = (e) => {
    setCurrentTitle(e.target.value);
  }

  //deletes whole deployment group and updates relationship values in crud endpoint
  //after successful deletion, redirect to deployment group table
  const handleClickDeleteGroupSelected = () => {

    let didTimeOut = false;
    // eslint-disable-next-line no-undef
    new Promise(function (resolve, reject) {

      const timeout = setTimeout(function () {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, 5000);

      authAPI.fetch(`/dbase/get_back_ref/deploy/id:${groupId}`, {
        method: 'DELETE'
      }).then((response) => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
          history.push('/deploy/deployment_groups');
        }
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
    })
      .then(function () {
      })
      .catch(function () {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  };

  return (
    <div className={classes.iconContainer}>
      <TextField
        id="standard-name"
        label="Deployment Group Title"
        className={classes.textField}
        onChange={e => handleChange(e)}
        value={currentTitle}
        margin="normal"
        inputProps={{ maxLength: 15 }}
      />
      <Tooltip title={"Save Deployment Group Changes"}>
        <IconButton
          onClick={() => { handleSaveDeploymentGroup() }}
        >
          <SaveIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Delete Group"}>
        <IconButton
          className={classes.iconButton}
          onClick={() => { handleClickDeleteGroupSelected() }}
        >
          <DeleteForeverIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Cancel and Return"}>
        <IconButton
          onClick={() => { handleCancelEdit() }}
        >
          <CancelIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default withRouter(CustomToolbarSelect);
