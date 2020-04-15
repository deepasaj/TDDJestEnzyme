import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { useParams } from 'react-router-dom';
import EditDeploymentGroupTable from './EditDeploymentGroupTable';

import './styles.css';

const EditDeploymentGroups = () => {
  const { groupId } = useParams();
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Deploy', path: '/workflow/deploy' },
    { text: `Edit Deployment Group ${groupId}`, path: `/workflow/deploy/group/edit/${groupId}` },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="EditDeploymentGroups">
          <EditDeploymentGroupTable groupId={groupId} />
        </div>
      </main>
    </>
  );
};

export default EditDeploymentGroups;
