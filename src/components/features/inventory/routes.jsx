import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import InventoryMenu from './InventoryMenu';
import AddDevices from './Add';
import BulkOperations from './Add/Bulk';
import ListInventory from './List';
import ManageInventory from './Manage';
import { useFeaturePermission } from './hooks';

const InventoryRoutes = ({ NotFound }) => {
  const [hasReadAccess] = useFeaturePermission();

  return hasReadAccess ? (
    <Switch>
      <Route exact path="/inventory" component={InventoryMenu} />
      <Route path="/inventory/add" component={AddDevices} />
      <Route path="/inventory/bulk" component={BulkOperations} />
      <Route path="/inventory/list" component={ListInventory} />
      <Route path="/inventory/manage" component={ManageInventory} />
      <Route component={NotFound} />
    </Switch>
  ) : <Route component={NotFound} />;
};

InventoryRoutes.propTypes = {
  NotFound: PropTypes.elementType.isRequired,
};

export default InventoryRoutes;
