import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { Security, LoginCallback } from '@okta/okta-react';
import { SnackbarProvider } from "notistack";
import Home from "components/Home";
import NotFound from "components/NotFound";
import User from "components/User";
import { UserRequired } from "store/store";
import { OKTA_OIDC } from 'config';

import AdminRoutes from 'components/admin/routes'
import InventoryRoutes from "components/features/inventory/routes"
import WorkflowRoutes from "components/features/workflow/routes"
import DashboardRoutes from 'components/features/dashboard/routes'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/css/form.css';
import 'assets/css/starter-template.css';

export const history = createBrowserHistory();

const App = () => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      maxSnack={8}
      style={{ width: 380 }}
    >
      <Router history={history}>
        <Security {...OKTA_OIDC}>
          <Switch>
            <Route path='/auth/callback' component={LoginCallback} />
            <Route>
              <UserRequired>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/home/index' component={Home} />
                  <Route path='/me' component={User} />
                  <Route path='/admin'>
                    <AdminRoutes NotFound={NotFound} />
                  </Route>
                  <Route path='/inventory'>
                    <InventoryRoutes NotFound={NotFound} />
                  </Route>
                  <Route path='/workflow'>
                    <WorkflowRoutes NotFound={NotFound} />
                  </Route>
                  <Route path='/dashboard'>
                    <DashboardRoutes NotFound={NotFound} />
                  </Route>
                  <Route component={NotFound} />
                </Switch>
              </UserRequired>
            </Route>
          </Switch>
        </Security>
      </Router>
    </SnackbarProvider>
  )
};


ReactDOM.render(<App/>, document.getElementById("root"));
