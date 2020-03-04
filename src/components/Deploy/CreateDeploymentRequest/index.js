import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import CreateDeploymentRequestTable from "./CreateDeploymentRequestTable";

import './styles.css';

const CreateDeploymentRequest = () => {
  const { createDeploymentGroupId } = useParams();
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Deploy', path: '/deploy'},
    { text: `Create Deployment Request for Deployment Group ${createDeploymentGroupId}`, path: `/deploy/deployment/create/${createDeploymentGroupId}` }
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="CreateDeploymentRequest">
          <CreateDeploymentRequestTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default CreateDeploymentRequest;