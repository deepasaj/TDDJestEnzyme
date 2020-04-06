import React from 'react';
import { useHistory } from 'react-router-dom';
import NotFoundImg from 'assets/img/sad-panda-404.jpg';
import './styles.css';

const NotFound = (props) => {
  const history = useHistory();
  const { message } = props;
  const defaultMsg = '404 Not Found: The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.'
  return (
      <React.Fragment>
        <div className="NotFound">
          <h1>Page not Found</h1>
          <p>
            {message ? message : defaultMsg}
          </p>
          <p><a onClick={() => history.push('/')} >Back to Homepage</a></p>
          <center>
            <img src={NotFoundImg} alt="Not found panda" />
          </center>
        </div>
      </React.Fragment>
    );
}

export default NotFound;