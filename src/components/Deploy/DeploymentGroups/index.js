import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import DeploymentGroupsTable from "./DeploymentGroupsTable";

import './styles.css';

const DeploymentGroups = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Deploy', path: '/deploy'},
    { text: 'Deployment Groups', path: '/deploy/deployment_groups'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="DeploymentGroups">
          <DeploymentGroupsTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default DeploymentGroups;