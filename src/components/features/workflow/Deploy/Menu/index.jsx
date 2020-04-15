import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import DeployMenu from './DeployMenu';

import './styles.css';

const Menu = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Deploy', path: '/workflow/deploy' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Menu">
          <DeployMenu />
        </div>
      </main>
    </>
  );
};

export default Menu;
