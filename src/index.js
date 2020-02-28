import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { SnackbarProvider } from "notistack";
import { PrivateRoute } from 'components/PrivateRoute';
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
import Login from "components/Login";
import NotFound from "components/NotFound";
import Job from "components/Job";
import JobTask from "components/Job/JobTask";
import User from "components/User";
import Validation from "components/Validation";
import ValidationReports from "components/Validation/ValidationReports";
import { StoreProvider } from "store/store";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/css/form.css';
import 'assets/css/starter-template.css';

export const history = createBrowserHistory();

const App = (
  <StoreProvider>
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      maxSnack={8}
      style={{ width: 380 }}
    >
      <Router history={history}>
        <Switch>
          <Route path='/login' component={Login}/>
          <PrivateRoute exact path='/' component={Home}/>
          <PrivateRoute path='/home/index' component={Home}/>
          <PrivateRoute path='/admin' component={Admin}/>
          <PrivateRoute path='/dashboard' component={Dashboard}/>
          <PrivateRoute exact path='/deploy' component={DeployMenu}/>
          <PrivateRoute path='/deploy/group/create' component={CreateDeploymentGroup}/>
          <PrivateRoute path='/deploy/group/edit/:groupId' component={EditDeploymentGroups}/>
          <PrivateRoute path='/deploy/deployment/create/:createDeploymentGroupId' component={CreateDeploymentRequest}/>
          <PrivateRoute path='/deploy/deployment_builder/:job_id' component={DeploymentBuilder}/>
          <PrivateRoute path='/deploy/deployment_groups' component={DeploymentGroups}/>
          <PrivateRoute exact path='/inventory' component={Inventory}/>
          <PrivateRoute path='/inventory/add' component={AddDevices}/>
          <PrivateRoute path='/inventory/bulk' component={BulkOperations}/>
          <PrivateRoute path='/inventory/list' component={ListInventory}/>
          <PrivateRoute path='/inventory/manage' component={ManageInventory}/>
          <PrivateRoute exact path='/job' component={Job}/>
          <PrivateRoute path='/job/tasks/:jobId' component={JobTask}/>
          <PrivateRoute path='/user/:username' component={User}/>
          <PrivateRoute exact path='/validation' component={Validation}/>
          <PrivateRoute path='/validation/reports/:jobId' component={ValidationReports}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    </SnackbarProvider>
  </StoreProvider>
);

ReactDOM.render(App, document.getElementById("root"));
