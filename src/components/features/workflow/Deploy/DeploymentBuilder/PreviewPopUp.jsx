import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '10px 10px 10px 25px',
  },
  btn_secondary: {
    marginTop: '10px 0px 10px 0px',
    backgroundColor: '#dc3545',
  },
}));

const PreviewPopUp = ({ showPreview, handleClose, previewConfig }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={showPreview}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <b>Device Config Preview</b>
      </DialogTitle>
      <DialogContent dividers style={{ fontSize: '.8em', whiteSpace: 'pre-line' }}>
        {previewConfig}
      </DialogContent>
      <DialogActions>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={handleClose}
            className={classes.btn_primary}
          >
            Close
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

PreviewPopUp.propTypes = {
  showPreview: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  previewConfig: PropTypes.any.isRequired,
};

export default PreviewPopUp;
