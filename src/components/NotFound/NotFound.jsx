/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import NotFoundImg from 'assets/img/sad-panda-404.jpg';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import './styles.css';


const useStyles = makeStyles({
  backToHome: {
    color: '#007bff',
  },
});

const NotFound = ({ message }) => {
  const classes = useStyles();
  const history = useHistory();
  const defaultMsg = '404 Not Found: The requested URL was not found on the server. '
                     + 'If you entered the URL manually please check your spelling and try again.';
  return (
    <>
      <div className="NotFound">
        <h1>Page not Found</h1>
        <p>
          {message || defaultMsg}
        </p>
        <Link component="button" className={classes.backToHome} onClick={() => history.push('/')}>
          Back to Homepage
        </Link>
        <center>
          <img src={NotFoundImg} alt="Not found panda" />
        </center>
      </div>
    </>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
};

export default NotFound;
