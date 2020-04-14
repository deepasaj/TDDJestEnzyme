import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  loading: {
    margin: 'auto',
  },
  text: {
    paddingTop: '15px',
    fontWeight: '500px',
    fontSize: '20px',
  },
  topStyle: {
    textAlign: 'center',
    padding: '50px',
  },
}));

const ValidateDeviceLoading = ({ circleValue }) => {
  const classes = useStyles();
  return (
    <div className={classes.topStyle}>
      <CircularProgress variant="static" value={circleValue} className={classes.circle} size="5rem" thickness={10} />
      <div className={classes.text}> Validating... </div>
    </div>
  );
};

ValidateDeviceLoading.propTypes = {
  circleValue: PropTypes.number.isRequired,
};

export default ValidateDeviceLoading;
