import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  title: {
    paddingTop: '5px',
    marginBottom: "-6px"
  },
  content: {
    minWidth: 300,
    margin: '0 10px',
    paddingTop: "20px",
    paddingBottom: "24px"
  },
  actions: {
    justifyContent: "center",
    marginTop: "-10px",
    marginBottom: "3px"
  },
  updateButton: {
    margin: '25px 0px 0px 25px'
  },
  cancelButton: {
    marginTop: '25px',
    backgroundColor: '#dc3545',
  },
}));

const EditGroupDialog = ({ initialName, onClose, onProceed }) => {
  const classes = useStyles();
  const [name, setName] = useState(initialName)

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        Edit Group Name
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        <TextField fullWidth placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.cancelButton} color="secondary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button className={classes.updateButton} type="submit" color="primary" variant="contained" onClick={() => onProceed(name)} >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditGroupDialog