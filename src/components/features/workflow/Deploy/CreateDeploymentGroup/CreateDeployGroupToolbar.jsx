import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      <Tooltip title="View Deployment Groups">
        <IconButton
          aria-label="delete"
          className={classes.margin}
          onClick={() => history.push('/workflow/deploy/deployment_groups')}
        >
          <ListAltIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default Toolbar;
