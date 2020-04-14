import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  title: {
    paddingTop: '5px',
    marginBottom: '-6px',
  },
  content: {
    width: 400,
    margin: '0 10px',
    paddingTop: '20px',
    paddingBottom: '24px',
  },
  actions: {
    justifyContent: 'center',
    marginTop: '-10px',
    marginBottom: '3px',
  },
  updateButton: {
    margin: '25px 0px 0px 25px',
  },
  cancelButton: {
    marginTop: '25px',
    backgroundColor: '#dc3545',
  },
}));

const CreateRoleDialog = ({ show, onClose, onProceed }) => {
  const [name, setName] = useState('');
  const classes = useStyles();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogContent dividers className={classes.content}>
        <div>
          {' '}
          Please title your role before proceeding. Click
          <b>Create and Continue</b>
          {' '}
          to create the role or
          <b> Cancel </b>
          {' '}
          to make changes.
          {' '}
        </div>
        <TextField fullWidth placeholder="Title" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.cancelButton} color="secondary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={classes.updateButton}
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => onProceed(name)}
        >
          Create And Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateRoleDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
};

export default CreateRoleDialog;
