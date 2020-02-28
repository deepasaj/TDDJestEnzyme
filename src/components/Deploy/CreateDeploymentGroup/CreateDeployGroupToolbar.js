import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from "@material-ui/core/styles";
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
      <Tooltip title={"View Deployment Groups"} >
        <IconButton
          aria-label="delete"
          className={classes.margin}
          onClick={() => history.push('/deploy/deployment_groups')}
        >
          <ListAltIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

export default withRouter(Toolbar);