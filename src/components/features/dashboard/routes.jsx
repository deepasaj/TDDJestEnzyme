import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from "./";
import { useFeaturePermission } from './hooks';

const DashboardRoutes = ({ NotFound }) => {
  const [hasReadAccess] = useFeaturePermission()

  return hasReadAccess ? (
    <Switch>
      <Route path='/dashboard' component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />
}

export default DashboardRoutes