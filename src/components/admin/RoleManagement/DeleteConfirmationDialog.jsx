import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '5px 10px 10px 25px'
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
    justifyContent: "space-around",
  }
}));

const DeleteConfirmationDialog = ({ show, roleName, onClose, onProceed }) => {
  const classes = useStyles();
  return (
    <Dialog open={show} onClose={onClose} aria-labelledby="form-dialog-title" >
      <DialogContent dividers>
        Are you sure you would like to delete <b>{roleName}</b>?
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div >
          <Button color="secondary" variant="contained" onClick={onClose} className={classes.btn_secondary}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" className={classes.btn_primary} onClick={onProceed} >
            Delete
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog