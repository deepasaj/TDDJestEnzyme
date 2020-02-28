import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import HelpIcon from '@material-ui/icons/Help';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = (props) => {
  const classes = useStyles();
  const { history } = props;
  //redirect to deployment group creation table
  const handleClick = () => {
    history.push('/deploy/group/create');
  }
  return (
    <React.Fragment>
      <Tooltip title={"Create Deployment Group"} >
        <IconButton aria-label="delete" className={classes.margin} onClick={() => handleClick()}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Deployment Groups can be edited by only the user who created them.">
        <IconButton
         aria-label="helper"
         className={classes.margin}
        >
        <HelpIcon >
        </HelpIcon>
      </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

export default withRouter(Toolbar);