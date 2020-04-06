import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DeployMenu from "./Deploy/Menu";
import CreateDeploymentGroup from "./Deploy/CreateDeploymentGroup";
import CreateDeploymentRequest from "./Deploy/CreateDeploymentRequest";
import DeploymentBuilder from "./Deploy/DeploymentBuilder";
import DeploymentGroups from "./Deploy/DeploymentGroups";
import EditDeploymentGroups from "./Deploy/EditDeploymentGroups";
import Job from "./Job";
import JobTask from "./Job/JobTask";
import Validation from "./Validation";
import ValidationReports from "./Validation/ValidationReports";
import { useFeaturePermission } from './hooks';

const WorkflowRoutes = ({ NotFound }) => {
  const [hasReadAccess] = useFeaturePermission()

  return hasReadAccess ? (
    <Switch>
      <Route exact path='/workflow/deploy' component={DeployMenu} />
      <Route path='/workflow/deploy/group/create' component={CreateDeploymentGroup} />
      <Route path='/workflow/deploy/group/edit/:groupId' component={EditDeploymentGroups} />
      <Route path='/workflow/deploy/deployment/create/:createDeploymentGroupId' component={CreateDeploymentRequest} />
      <Route path='/workflow/deploy/deployment_builder/:job_id' component={DeploymentBuilder} />
      <Route path='/workflow/deploy/deployment_groups' component={DeploymentGroups} />
      <Route exact path='/workflow/job' component={Job} />
      <Route path='/workflow/job/tasks/:jobId' component={JobTask} />
      <Route exact path='/workflow/validation' component={Validation} />
      <Route path='/workflow/validation/reports/:jobId' component={ValidationReports} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />
}

export default WorkflowRoutes