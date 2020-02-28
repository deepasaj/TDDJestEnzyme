import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import JobTasksTable from "./JobTasksTable";
import { useParams } from 'react-router-dom';

import './styles.css';

const JobTask = () => {
  let { jobId } = useParams();
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Manage Jobs', path: '/job'},
    { text: 'Job Tasks', path: `/job/tasks/${jobId}`},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="JobTask">
          <JobTasksTable />
        </div>
      </main>
    </React.Fragment>
  );
}

export default JobTask;