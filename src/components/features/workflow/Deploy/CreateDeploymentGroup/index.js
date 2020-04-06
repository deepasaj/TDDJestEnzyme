import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import CreateDeploymentGroupTable from "./CreateDeploymentGroupTable";

import './styles.css';

const CreateDeploymentGroup = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Deploy', path: '/workflow/deploy'},
    { text: 'Create Deployment Group', path: '/workflow/deploy/group/create'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="CreateDeploymentGroup">
          <CreateDeploymentGroupTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default CreateDeploymentGroup;