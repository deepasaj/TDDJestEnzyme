import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import Builder from "./builder";

import './styles.css';

const DeploymentBuilder = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Deploy', path: '/deploy'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="DeploymentBuilder">
        <Builder />
      </main>
    </React.Fragment>
  );
}

export default DeploymentBuilder;