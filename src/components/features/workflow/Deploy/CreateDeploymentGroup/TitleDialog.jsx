import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import { useUser, useAuthAPI } from 'store/store';
import { useSnackbar } from 'notistack';
import { showNotification } from 'utils/notifications';


const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '10px 25px 10px 25px',
  },
  btn_secondary: {
    marginTop: '10px 0px 10px 0px',
    marginLeft: '23px',
    backgroundColor: '#dc3545',
  },
  actions: {
    display: 'block',
    textAlign: 'center',
  },
  content: {
    display: 'grid',
    width: '450px',
  },
  textField: {
    width: '250px',
    margin: 'auto',
  },
}));

const TitlePopUp = ({
  showSetTitle, selectedRows, displayData, setGroupId, setShowSetTitle,
}) => {
  const classes = useStyles();
  const user = useUser();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authAPI = useAuthAPI();

  // set title state every time a change to the field occurs
  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  // close TitleDialog
  const cancelCreation = () => {
    setShowSetTitle(false);
  };

  // create array containing device ids as seen in the db based on selectedRows
  // selectedRows is a prop created by mui-Datatables
  const changePage = () => {
    const values = selectedRows.data.map(
      (row) => displayData[row.index].data[0],
    );
    setSelectedDevices(values);
  };

  // if group successfully created, redirect to deployment groups
  const groupCreated = () => {
    history.push('/workflow/deploy/deployment_groups');
  };

  // post deployment group to db
  // using back_populate endpoint to use relationships connecting deployment_group table to inventory table
  const postDeploymentGroup = () => {
    const body = { data: [{ devices: selectedDevices, user_id: user.id, name: title }] };

    authAPI.post('/workflow/back_populate/deploy', body).then(({ data }) => {
      setGroupId(data.id);
      groupCreated();
    }).catch((e) => {
      console.error(e);
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  useEffect(() => {
    if (selectedDevices.length > 0) {
      postDeploymentGroup();
    }
  }, [selectedDevices]);

  return (
    <Dialog
      open={showSetTitle}
      aria-labelledby="form-dialog-title"
      className={classes.dialog}
    >
      <DialogContent dividers className={classes.content}>
        <div>
          {' '}
          Please title your deployment group before proceeding. Click
          <b>Create and Continue</b>
          {' '}
          to create the group or
          <b> Cancel </b>
          {' '}
          to make changes.
          {' '}
        </div>
        <TextField
          id="standard-name"
          label="Title"
          className={classes.textField}
          onChange={(e) => handleChange(e)}
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

TitlePopUp.propTypes = {
  showSetTitle: PropTypes.bool.isRequired,
  setShowSetTitle: PropTypes.func.isRequired,
  setGroupId: PropTypes.func.isRequired,
  selectedRows: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      dataIndex: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  displayData: PropTypes.array.isRequired,
};

export default TitlePopUp;
