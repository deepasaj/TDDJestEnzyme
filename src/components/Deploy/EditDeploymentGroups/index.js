import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import EditDeploymentGroupTable from "./EditDeploymentGroupTable";
import { useParams } from 'react-router-dom';

import './styles.css';

const EditDeploymentGroups = () => {
  let { groupId } = useParams();
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs />
      <main id="main" role="main" className="container">
        <div className="EditDeploymentGroups">
          <EditDeploymentGroupTable groupId={groupId} />
        </div>
      </main>
    </React.Fragment>
  );
}

export default EditDeploymentGroups;