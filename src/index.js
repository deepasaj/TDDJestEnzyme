import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback, Auth } from '@okta/okta-react';
import { SnackbarProvider } from "notistack";
import Admin from "components/Admin";
import Dashboard from "components/Dashboard";
import DeployMenu from "components/Deploy/Menu";
import CreateDeploymentGroup from "components/Deploy/CreateDeploymentGroup";
import CreateDeploymentRequest from "components/Deploy/CreateDeploymentRequest";
import DeploymentBuilder from "components/Deploy/DeploymentBuilder";
import DeploymentGroups from "components/Deploy/DeploymentGroups";
import EditDeploymentGroups from "components/Deploy/EditDeploymentGroups";
import Home from "components/Home";
import Inventory from "components/Inventory";
import AddDevices from "components/Inventory/Add";
import BulkOperations from "components/Inventory/Add/Bulk";
import ListInventory from "components/Inventory/List";
import ManageInventory from "components/Inventory/Manage";
import NotFound from "components/NotFound";
import Job from "components/Job";
import JobTask from "components/Job/JobTask";
import User from "components/User";
import Validation from "components/Validation";
import ValidationReports from "components/Validation/ValidationReports";
import { AuthStoreProvider } from "store/store";
import { OKTA_ODIC } from 'config';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/css/form.css';
import 'assets/css/starter-template.css';

export const history = createBrowserHistory();

const auth = new Auth({
  history,
  ...OKTA_ODIC
});

const App = () => {
  return (
    <AuthStoreProvider auth={auth} history={history}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        maxSnack={8}
        style={{ width: 380 }}
      >
      <Router history={history}>
          <Security auth={auth}>
            <Switch>            
              <Route path='/auth/callback' component={ImplicitCallback} />
              <Route exact path='/' component={Home}/>
              <Route path='/home/index' component={Home}/>
              <Route path='/admin' component={Admin}/>
              <Route path='/dashboard' component={Dashboard}/>
              <Route exact path='/deploy' component={DeployMenu}/>
              <Route path='/deploy/group/create' component={CreateDeploymentGroup}/>
              <Route path='/deploy/group/edit/:groupId' component={EditDeploymentGroups}/>
              <Route path='/deploy/deployment/create/:createDeploymentGroupId' component={CreateDeploymentRequest}/>
              <Route path='/deploy/deployment_builder/:job_id' component={DeploymentBuilder}/>
              <Route path='/deploy/deployment_groups' component={DeploymentGroups}/>
              <Route exact path='/inventory' component={Inventory}/>
              <Route path='/inventory/add' component={AddDevices}/>
              <Route path='/inventory/bulk' component={BulkOperations}/>
              <Route path='/inventory/list' component={ListInventory}/>
              <Route path='/inventory/manage' component={ManageInventory}/>
              <Route exact path='/job' component={Job}/>
              <Route path='/job/tasks/:jobId' component={JobTask}/>
              <Route path='/user/me' component={User}/>
              <Route exact path='/validation' component={Validation}/>
              <Route path='/validation/reports/:jobId' component={ValidationReports}/>
              <Route component={NotFound}/>
            </Switch>                    
          </Security>
        </Router>
      </SnackbarProvider>
    </AuthStoreProvider>
)};


ReactDOM.render(<App/>, document.getElementById("root"));
