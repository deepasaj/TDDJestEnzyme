import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './styles.css';

const Breadcrumbs = ({ paths }) => (
  <div className="Breadcrumbs">
    {
      paths && paths.length !== 0 ? (
        paths.map((pathObj, index) => (
          <span key={pathObj.path}>
            <Link to={pathObj.path}>{pathObj.text}</Link>
            {index + 1 < paths.length ? ' > ' : ''}
          </span>
        ))
      ) : null
    }
  </div>
);

Breadcrumbs.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default Breadcrumbs;
