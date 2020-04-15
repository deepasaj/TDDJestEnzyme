import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';
import { useHistory } from 'react-router-dom';
import { useFeaturePermission } from '../../hooks';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = () => {
  const classes = useStyles();
  const [, hasWriteAccess] = useFeaturePermission();
  const history = useHistory();
  // redirect to deployment group creation table
  const handleClick = () => {
    history.push('/workflow/deploy/group/create');
  };
  return hasWriteAccess && (
    <>
      <Tooltip title="Create Deployment Group">
        <IconButton
          aria-label="delete"
          className={classes.margin}
          disabled={!hasWriteAccess}
          onClick={() => handleClick()}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Deployment Groups can be edited by only the user who created them.">
        <IconButton
          aria-label="helper"
          className={classes.margin}
        >
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default Toolbar;
