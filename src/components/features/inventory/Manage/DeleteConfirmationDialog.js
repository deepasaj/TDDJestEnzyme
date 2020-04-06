import React, { useEffect } from "react";
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


const DeleteConfirmModal = (props) => {
  const classes = useStyles();
  const { handleClose, handleDelete, device, showDeleteConfirm, selectedDevices, singleDelete, deleteMult } = props;
  const [hostnames, setHostnames] = React.useState("");

  //set up the correct wording for the delete confirmation dialog based on how many devices are selected
  //triggered whenever devices are selected
  useEffect(() => {
    var hostnameList = "";
    var count = 0;
    if (selectedDevices.length > 0) {
       for (var idx in selectedDevices) {
        hostnameList += selectedDevices[idx].hostname;
        count++;
        if (selectedDevices.length === 2 && count != selectedDevices.length) {
          hostnameList += " and "
        } else {
          if (count != selectedDevices.length) {
            hostnameList += ", ";
          }
          if (count == selectedDevices.length - 1) {
            hostnameList += "and ";
          }
        }
       }
    }
    setHostnames(hostnameList);
  }, [selectedDevices])

  return(
    <Dialog open={showDeleteConfirm} onClose={handleClose} aria-labelledby="form-dialog-title" >
      <DialogContent dividers>
         {singleDelete ? (
            <React.Fragment>
              Are you sure you would like to delete <b>{device.hostname}</b>?
             </React.Fragment>
          ) : (
            <React.Fragment>
              Are you sure you would like to delete <b>{hostnames}</b>?
            </React.Fragment>
          )
           }
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div >
          <Button color="secondary" variant="contained" onClick={handleClose} className={classes.btn_secondary}>
            Cancel
            </Button>
         {singleDelete ? (
            <Button color="primary" variant="contained" className={classes.btn_primary} onClick={handleDelete} >
              Delete
            </Button>
          ) : (
            <Button color="primary" variant="contained" className={classes.btn_primary} onClick={deleteMult} >
               Delete
            </Button>
          )
           }
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmModal;