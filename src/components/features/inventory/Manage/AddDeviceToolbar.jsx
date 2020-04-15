import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useFeaturePermission } from '../hooks';


const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = ({ setShow, setShowButton, setDevice }) => {
  const classes = useStyles();
  const [, hasWriteAccess] = useFeaturePermission();

  // set to add device view rather than edit with setShowButton
  // open DeviceInfoDialog
  // clear device state
  const handleClick = () => {
    setShowButton(false);
    setShow(true);
    setDevice({
      hostname: '',
      mgmt_ip: '',
    });
  };

  return hasWriteAccess && (
    <Tooltip title="Add New Inventory Item">
      <IconButton
        aria-label="add"
        className={classes.fab}
        size="medium"
        onClick={handleClick}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};

Toolbar.propTypes = {
  setShow: PropTypes.func.isRequired,
  setShowButton: PropTypes.func.isRequired,
  setDevice: PropTypes.func.isRequired,
};

export default Toolbar;
