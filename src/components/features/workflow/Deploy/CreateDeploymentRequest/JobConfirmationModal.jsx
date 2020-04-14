import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '10px 25px 10px 25px',
    // width: "90%"
  },
  btn_secondary: {
    marginTop: '10px 0px 10px 0px',
    backgroundColor: '#dc3545',
  },
  actions: {
    display: 'block',
    textAlign: 'center',
  },
  textField: {
    width: '350px',
    margin: 'auto',
  },
  content: {
    display: 'grid',
    width: '600px',
  },
}));

const ConfirmationPopUp = (props) => {
  const classes = useStyles();
  const { showConfirmation, setShowConfirmation, postJob } = props;
  const [title, setTitle] = useState('');

  // update state every time title field changes
  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  // close JobConfirmationModal
  const cancelCreation = () => {
    setShowConfirmation(false);
  };

  // call to kickoff job creation orchestration
  const createJob = () => {
    postJob(title);
  };

  return (
    <Dialog
      open={showConfirmation}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent dividers className={classes.content}>
        <div className={classes.enterTitle}>
          {' '}
          Please title your job before proceeding. Click
          <b>Create and Continue</b>
          {' '}
          to create the job or
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
            className={classes.btn_primary}
            onClick={createJob}
          >
            Create and Continue
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationPopUp.propTypes = {
  showConfirmation: PropTypes.bool.isRequired,
  setShowConfirmation: PropTypes.func.isRequired,
  postJob: PropTypes.func.isRequired,
};

export default ConfirmationPopUp;
