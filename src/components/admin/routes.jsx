import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { useIsAdmin } from 'store/store';
import RoleManagement from './RoleManagement';
import EditRole from './RoleManagement/EditRole';
import CreateRole from './RoleManagement/CreateRole';
import AdminMenu from './AdminMenu';

const AdminRoutes = ({ NotFound }) => {
  const isAdmin = useIsAdmin();

  return isAdmin ? (
    <Switch>
      <Route path="/admin/role_management/create_role" component={CreateRole} />
      <Route path="/admin/role_management/edit_role/:roleId" component={EditRole} />
      <Route path="/admin/role_management" component={RoleManagement} />
      <Route path="/admin" component={AdminMenu} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />;
};

AdminRoutes.propTypes = {
  NotFound: PropTypes.elementType.isRequired,
};

export default AdminRoutes;
