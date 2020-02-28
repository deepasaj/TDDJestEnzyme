import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const Breadcrumbs = (props) => {
  const { paths } = props;
  return (
    <div className="Breadcrumbs">
      {
        paths && paths.length !== 0 ? (
          paths.map((pathObj, index) => (
            <span key={index}>
              <Link to={pathObj.path}>{pathObj.text}</Link>
              {paths[index+1] ? ' > ' : ''}
            </span>
          ))
        ) : null
      }
    </div>
  );
}

export default Breadcrumbs;