import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { useParams } from 'react-router-dom';
import JobTasksTable from './JobTasksTable';

import './styles.css';

const JobTask = () => {
  const { jobId } = useParams();
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Manage Jobs', path: '/workflow/job' },
    { text: 'Job Tasks', path: `/workflow/job/tasks/${jobId}` },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="JobTask">
          <JobTasksTable />
        </div>
      </main>
    </>
  );
};

export default JobTask;
