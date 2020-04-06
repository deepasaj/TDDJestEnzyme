import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import BulkUpload from "./BulkUpload";

import './styles.css';

const Add = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Inventory', path: '/inventory'},
    { text: 'Add Devices', path: '/inventory/add'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Add">
          <BulkUpload />
        </div>
      </main>
    </React.Fragment>
  );
}

export default Add;