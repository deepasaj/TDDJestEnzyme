import React from 'react'
import { Route, Switch } from 'react-router-dom';
import RoleManagement from "./RoleManagement/";
import EditRole from "./RoleManagement/EditRole";
import CreateRole from "./RoleManagement/CreateRole";
import AdminMenu from "./AdminMenu";
import { useIsAdmin } from 'store/store';

const AdminRoutes = ({ NotFound }) => {
  const isAdmin = useIsAdmin()

  return isAdmin ? (
    <Switch>
      <Route path='/admin/role_management/create_role' component={CreateRole} />
      <Route path='/admin/role_management/edit_role/:roleId' component={EditRole} />
      <Route path='/admin/role_management' component={RoleManagement} />
      <Route path='/admin' component={AdminMenu} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />
}

export default AdminRoutes