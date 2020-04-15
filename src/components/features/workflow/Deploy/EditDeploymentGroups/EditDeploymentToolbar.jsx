import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';
import { useHistory } from 'react-router-dom';
import { useAuthAPI } from 'store/store';

const useStyles = makeStyles(() => ({
  iconContainer: {
    marginRight: '24px',
  },
  textField: {
    margin: '0px',
  },
}));

const CustomToolbarSelect = ({
  groupId, selectedRows, displayData, currentTitle, setCurrentTitle,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedDevices, setSelectedDevices] = useState([]);
  const authAPI = useAuthAPI();

  const handleSaveDeploymentGroup = () => {
    // selectedRows is the dataIndex value
    const selectedRowDataIndexes = selectedRows.data.map((x) => x.dataIndex);
    const selectedDeviceObjects = displayData.filter((x) => selectedRowDataIndexes.includes(x.dataIndex));
    const deviceIds = selectedDeviceObjects.map((x) => x.data[0]);
    setSelectedDevices(deviceIds);
  };

  // patch a deployment group if save button is clicked, take newly selected devices and update
  // relationship values
  const patchDeploymentGroup = () => {
    const postData = { devices: selectedDevices, name: currentTitle };

    authAPI.patch(`/workflow/back_populate/deploy/id:${groupId}`, postData).then(() => {
      history.push('/workflow/deploy/deployment_groups');
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  useEffect(() => {
    if (!_.isEmpty(selectedDevices)) {
      patchDeploymentGroup();
    }
  }, [selectedDevices]);

  // redirect back to deployment group table without editing
  const handleCancelEdit = () => {
    history.push('/workflow/deploy/deployment_groups');
  };

  // track changes to title field
  const handleChange = (e) => {
    setCurrentTitle(e.target.value);
  };

  // deletes whole deployment group and updates relationship values in crud endpoint
  // after successful deletion, redirect to deployment group table
  const handleClickDeleteGroupSelected = () => {
    authAPI.delete(`/workflow/get_back_ref/deploy/id:${groupId}`).then(() => {
      history.push('/workflow/deploy/deployment_groups');
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  return (
    <div className={classes.iconContainer}>
      <TextField
        id="standard-name"
        label="Deployment Group Title"
        className={classes.textField}
        onChange={(e) => handleChange(e)}
        value={currentTitle}
        margin="normal"
        inputProps={{ maxLength: 15 }}
      />
      <Tooltip title="Save Deployment Group Changes">
        <IconButton
          onClick={() => { handleSaveDeploymentGroup(); }}
        >
          <SaveIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Group">
        <IconButton
          className={classes.iconButton}
          onClick={() => { handleClickDeleteGroupSelected(); }}
        >
          <DeleteForeverIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Cancel and Return">
        <IconButton
          onClick={() => { handleCancelEdit(); }}
        >
          <CancelIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

CustomToolbarSelect.propTypes = {
  groupId: PropTypes.string.isRequired,
  displayData: PropTypes.arrayOf(PropTypes.shape({
    dataIndex: PropTypes.number.isRequired,
  })).isRequired,
  selectedRows: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  currentTitle: PropTypes.string.isRequired,
  setCurrentTitle: PropTypes.func.isRequired,
};

export default CustomToolbarSelect;
