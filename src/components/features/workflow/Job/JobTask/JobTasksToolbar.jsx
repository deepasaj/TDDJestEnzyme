import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

const JobTasksToolbar = ({ refreshData }) => {
  const history = useHistory();

  return (
    <>
      <Tooltip title="Return to Jobs">
        <IconButton
          onClick={() => history.push('/workflow/job')}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh Table">
        <IconButton
          aria-label="helper"
          onClick={refreshData}
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

JobTasksToolbar.propTypes = {
  refreshData: PropTypes.func.isRequired,
};

export default JobTasksToolbar;
