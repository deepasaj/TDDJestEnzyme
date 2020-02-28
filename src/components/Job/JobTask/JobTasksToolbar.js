import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withRouter } from 'react-router-dom';

const JobTasksToolbar = (props) => {
  const { refreshData, history } = props;
  return (
    <React.Fragment>
      <Tooltip title={"Return to Jobs"} >
        <IconButton
          onClick={() => history.push('/job')}
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
    </React.Fragment>
  );
}

export default withRouter(JobTasksToolbar);