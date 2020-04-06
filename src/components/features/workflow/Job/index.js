import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import MyJobsTable from "./MyJobsTable";

import './styles.css';

const Job = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Manage Jobs', path: '/workflow/job'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="Job">
          <MyJobsTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default Job;