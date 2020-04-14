import React from 'react';
import ReactLoading from 'react-loading';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  loading: {
    margin: 'auto',
  },
  text: {
    textAlign: 'center',
    paddingTop: '15px',
  },
  topStyle: {
    paddingTop: '250px',
  },
}));

const LoadingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.topStyle}>
      <ReactLoading type="cylon" color="#3443eb" height={75} width={75} className={classes.loading} />
      <div className={classes.text}> Loading </div>
    </div>
  );
};

export default LoadingPage;
