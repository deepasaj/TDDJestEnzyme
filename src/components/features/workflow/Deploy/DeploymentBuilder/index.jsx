import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import Builder from './builder';

import './styles.css';

const DeploymentBuilder = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Deploy', path: '/workflow/deploy' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="DeploymentBuilder">
        <Builder />
      </main>
    </>
  );
};

export default DeploymentBuilder;
