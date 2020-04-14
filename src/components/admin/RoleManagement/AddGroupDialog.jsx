import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/store';

const useStyles = makeStyles(() => ({
  title: {
    paddingTop: '5px',
    marginBottom: '-6px',
  },
  content: {
    minWidth: 300,
    margin: '0 10px',
    paddingTop: '20px',
    paddingBottom: '24px',
  },
  actions: {
    justifyContent: 'center',
    marginTop: '-10px',
    marginBottom: '3px',
  },
  addButton: {
    margin: '25px 0px 0px 25px',
  },
  cancelButton: {
    marginTop: '25px',
    backgroundColor: '#dc3545',
  },
}));

const AddGroupDialog = ({ show, onClose, onFinish }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const authAPI = useAuthAPI();
  const [name, setName] = useState('');

  const addGroup = () => {
    authAPI.post('/admin/user_group/create', {
      data: {
        name,
      },
    }).then(() => {
      onFinish();
      onClose();
    }).catch(() => {
      showNotification(
        'There was an error contacting the database. Please contact administrator.',
        'error', enqueueSnackbar,
        closeSnackbar,
      );
    });
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>
        Add Group
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        <TextField fullWidth placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.cancelButton} color="secondary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button className={classes.addButton} type="submit" color="primary" variant="contained" onClick={addGroup}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddGroupDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default AddGroupDialog;
