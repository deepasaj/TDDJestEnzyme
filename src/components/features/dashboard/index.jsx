import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import Dashboard from './Dashboard';

import './styles.css';

const DashboardPage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Metrics', path: '/dashboard' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="dashboard-container">
        <div className="dashboard-container-inner">
          <Dashboard />
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
