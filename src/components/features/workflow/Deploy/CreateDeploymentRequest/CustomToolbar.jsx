import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  fab: {
    boxShadow: '0px 0px',
  },
}));

const Toolbar = ({ disableButton, setShowConfirmation }) => {
  const history = useHistory();
  const classes = useStyles();

  // open JobConfirmationModel on continue button click
  const handleClick = () => {
    setShowConfirmation(true);
  };

  // redirect back to deployment group table
  const handleBack = () => {
    history.push('/workflow/deploy/deployment_groups');
  };

  return (
    <>
      <Tooltip title="Return to Deployment Groups">
        <IconButton
          onClick={() => handleBack()}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Submit to continue">
        <span>
          <Fab
            variant="extended"
            aria-label="delete"
            className={classes.fab}
            size="medium"
            onClick={handleClick}
            disabled={disableButton}
          >
            Submit Job Request
          </Fab>
        </span>
      </Tooltip>
    </>
  );
};

Toolbar.propTypes = {
  disableButton: PropTypes.bool.isRequired,
  setShowConfirmation: PropTypes.func.isRequired,
};

export default Toolbar;
