import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import InventoryTable from "./Table";

import './styles.css';

const Manage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Inventory', path: '/inventory'},
    { text: 'Manage', path: '/inventory/manage'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Manage">
          <InventoryTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default Manage;