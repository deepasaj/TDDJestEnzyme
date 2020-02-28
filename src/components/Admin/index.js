import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';

const Admin = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Admin', path: '/admin'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="d-flex justify-content-center">
          Admin Page
        </div>
      </main>
    </React.Fragment>
  );
}

export default Admin;