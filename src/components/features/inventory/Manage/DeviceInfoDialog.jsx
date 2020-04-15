import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import ValidateDeviceLoading from './ValidateDeviceLoading';


// styles for EnhancedTable
const useStyles = makeStyles(() => ({
  btn_primary: {
    margin: '25px 0px 0px 25px',
  },
  btn_secondary: {
    marginTop: '25px',
    backgroundColor: '#dc3545',
  },
  modal_dialog: {
    maxWidth: '400px',
  },
  dialog_title: {
    paddingTop: '5px',
    marginBottom: '-6px',
  },
  actions: {
    justifyContent: 'center',
    marginTop: '-10px',
    marginBottom: '3px',
  },
  validForm: {
    border: 'none',
    boxShadow: 'none',
    padding: '10px',
    minWidth: '300px',
    minHeight: '294px',
  },
  form: {
    padding: '0px',
  },
  content: {
    paddingTop: '20px',
    paddingBottom: '24px',
  },
}));

// eslint-disable-next-line max-len
const validIP = /^10.(2(4[0-9]|5[0-5])).([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/(1[6-9]|2[0-9])$/;
const validHostname = /^([a-zA-Z0-9_]){8,13}$/;

const DeviceInfo = ({
  show, handleClose, handleSubmit, device, showButton, setDevice, loading, circleValue,
}) => {
  const classes = useStyles();

  // track changes to fields on the dialog in the device state
  const change = (e) => {
    setDevice({ ...device, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    ValidatorForm.addValidationRule('isValidIp', (value) => {
      if (value && !validIP.test(value)) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isValidHostname', (value) => {
      if (value && !validHostname.test(value)) {
        return false;
      }
      return true;
    });
  }, []);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableBackdropClick
      className={classes.form}
    >
      <ValidatorForm onSubmit={handleSubmit} className={classes.validForm}>
        <>
          {showButton ? (
            <DialogTitle id="form-dialog-title" className={classes.dialog_title}>Edit Inventory Item</DialogTitle>
          )
            : <DialogTitle id="form-dialog-title" className={classes.dialog_title}>New Inventory Item</DialogTitle>}
        </>

        {loading ? (
          <ValidateDeviceLoading
            circleValue={circleValue}
          />

        ) : (
          <>
            <DialogContent dividers className={classes.content}>
              <TextValidator
                name="hostname"
                label="Host Name"
                value={device.hostname}
                onChange={(e) => change(e)}
                validators={['required', 'isValidHostname']}
                errorMessages={['this field is required', 'not a valid hostname (8-13 characters)']}
                inputProps={{ maxLength: 15 }}
              />
              <br />
              <TextValidator
                name="mgmt_ip"
                label="Management IP"
                value={device.mgmt_ip}
                onChange={(e) => change(e)}
                validators={['required', 'isValidIp']}
                errorMessages={['this field is required', 'not a valid ip']}
                inputProps={{ maxLength: 30 }}
              />
              <br />

            </DialogContent>
            <DialogActions className={classes.actions}>
              {showButton ? (
                <div>
                  <Button color="secondary" variant="contained" onClick={handleClose} className={classes.btn_secondary}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained" className={classes.btn_primary}>
                    Update
                  </Button>
                </div>
              ) : (
                <div>
                  <Button color="secondary" variant="contained" onClick={handleClose} className={classes.btn_secondary}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained" className={classes.btn_primary}>
                    Add
                  </Button>
                </div>
              )}
            </DialogActions>
          </>

        )}

      </ValidatorForm>
    </Dialog>
  );
};

DeviceInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  showButton: PropTypes.bool.isRequired,
  setDevice: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  device: PropTypes.shape({
    hostname: PropTypes.string.isRequired,
    mgmt_ip: PropTypes.string.isRequired,
  }),
  circleValue: PropTypes.number.isRequired,
};

export default DeviceInfo;
