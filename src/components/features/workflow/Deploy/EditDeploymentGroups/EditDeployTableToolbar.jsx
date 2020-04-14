import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
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
      <Tooltip title="Cancel and Return">
        <IconButton
          onClick={() => history.push('/workflow/deploy/deployment_groups')}
        >
          <CancelIcon className={classes.icon} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default Toolbar;
