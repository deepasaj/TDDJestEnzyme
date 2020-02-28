import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import InvMenu from "./InvMenu";

import './styles.css';

const Inventory = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Inventory', path: '/inventory'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Inventory">
          <InvMenu />
        </div>
      </main>
    </React.Fragment>
  );
}

export default Inventory;