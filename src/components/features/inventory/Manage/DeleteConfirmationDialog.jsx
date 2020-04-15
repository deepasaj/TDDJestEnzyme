import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '5px 10px 10px 25px',
  },
  btn_secondary: {
    margin: '5px 10px 10px 0px',
    backgroundColor: '#dc3545',
  },
  modal_dialog: {
    maxWidth: '400px',
  },
  device_dropdown: {
    width: '200px',
    textAlign: 'left',
  },
  dialog_title: {
    paddingBottom: '0px',
  },
  actions: {
    justifyContent: 'space-around',
  },
}));


const DeleteConfirmModal = (props) => {
  const classes = useStyles();
  const {
    handleClose, handleDelete, device, showDeleteConfirm, selectedDevices, singleDelete, deleteMult,
  } = props;
  const [hostnames, setHostnames] = useState('');

  // set up the correct wording for the delete confirmation dialog based on how many devices are selected
  // triggered whenever devices are selected
  useEffect(() => {
    const hostnameList = selectedDevices.map(({ hostname }) => hostname);
    if (hostnames.length) {
      if (hostnames.length <= 2) {
        setHostnames(hostnameList.join(' and '));
      } else {
        setHostnames(`${hostnameList.slice(0, -1).join(', ')}, and ${hostnames[hostnames.length - 1]}`);
      }
    }
  }, [selectedDevices]);

  return (
    <Dialog open={showDeleteConfirm} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogContent dividers>
        {singleDelete ? (
          <>
            Are you sure you would like to delete
            {' '}
            <b>{device.hostname}</b>
            ?
          </>
        ) : (
          <>
            Are you sure you would like to delete
            {' '}
            <b>{hostnames}</b>
            ?
          </>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div>
          <Button color="secondary" variant="contained" onClick={handleClose} className={classes.btn_secondary}>
            Cancel
          </Button>
          {singleDelete ? (
            <Button color="primary" variant="contained" className={classes.btn_primary} onClick={handleDelete}>
              Delete
            </Button>
          ) : (
            <Button color="primary" variant="contained" className={classes.btn_primary} onClick={deleteMult}>
              Delete
            </Button>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmModal.propTypes = {
  showDeleteConfirm: PropTypes.bool.isRequired,
  singleDelete: PropTypes.bool,
  device: PropTypes.shape({
    hostname: PropTypes.string.isRequired,
  }),
  selectedDevices: PropTypes.arrayOf(PropTypes.shape({
    hostname: PropTypes.string.isRequired,
  })).isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  deleteMult: PropTypes.func,
};

export default DeleteConfirmModal;
