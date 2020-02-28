import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from '@material-ui/icons/Cancel';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = (props) => {
  const classes = useStyles();
  const { history } = props;

  return (
    <React.Fragment>
      <Tooltip title={"Cancel and Return"}>
        <IconButton
          onClick={() => history.push('/deploy/deployment_groups')}
        >
          <CancelIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

export default withRouter(Toolbar);