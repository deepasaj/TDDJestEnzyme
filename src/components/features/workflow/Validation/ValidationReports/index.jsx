import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import ValidationReports from './ValidationReports';

import './styles.css';

const ValidationReportsPage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Device Validation', path: '/validation' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="ValidationReportsPage">
          <ValidationReports />
        </div>
      </main>
    </>
  );
};

export default ValidationReportsPage;
