import React from 'react';
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
    handleClose, handleDelete, deploymentGroup, showDeleteConfirm,
  } = props;

  return (
    <Dialog open={showDeleteConfirm} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogContent dividers>
        <>
          Are you sure you would like to delete Deployment Group
          {' '}
          <b>{deploymentGroup}</b>
          ?
        </>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div>
          <Button color="secondary" variant="contained" onClick={handleClose} className={classes.btn_secondary}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" className={classes.btn_primary} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmModal.propTypes = {
  showDeleteConfirm: PropTypes.bool.isRequired,
  deploymentGroup: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
