import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { useFeaturePermission } from './hooks';
import Dashboard from '.';

const DashboardRoutes = ({ NotFound }) => {
  const [hasReadAccess] = useFeaturePermission();

  return hasReadAccess ? (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />;
};

DashboardRoutes.propTypes = {
  NotFound: PropTypes.elementType.isRequired,
};

export default DashboardRoutes;
