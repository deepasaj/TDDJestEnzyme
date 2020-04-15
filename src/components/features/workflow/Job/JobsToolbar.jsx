import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const JobsToolbar = ({ refreshData }) => {
  const classes = useStyles();

  return (
    <>
      <Tooltip title="Jobs can only be opened by the user who created them.">
        <IconButton
          aria-label="helper"
          className={classes.margin}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh Table">
        <IconButton
          aria-label="helper"
          className={classes.margin}
          onClick={refreshData}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>

    </>
  );
};

JobsToolbar.propTypes = {
  refreshData: PropTypes.func.isRequired,
};

export default JobsToolbar;
