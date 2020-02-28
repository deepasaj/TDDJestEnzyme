import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import CreateDeploymentRequestTable from "./CreateDeploymentRequestTable";

import './styles.css';

const CreateDeploymentRequest = () =>{
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs />
      <main id="main" role="main" className="container">
        <div className="CreateDeploymentRequest">
          <CreateDeploymentRequestTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default CreateDeploymentRequest;