import axios from "axios";
import React, { useEffect, useState } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { API_URL } from 'config';
import { getAuthHeader } from 'utils/auth';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/auth-store'

import './styles.css';

const List = () => {
  const [state] = useStateValue();
  const authAPI = useAuthAPI();

  const [items, setItems] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    authAPI.get(API_URL + "/inventory/list", { timeout: 5000 })
      .then((resp) => {
        setItems(resp.data.inventoryRecords);
      }).catch(() => {
        showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
      });
  }, []);

  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
    { text: 'Inventory', path: '/inventory'},
  ];

  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="container">
        <div className="d-flex justify-content-center">
          <form id="list">
              <h3>Inventory</h3>

              <table className="table table-bordered table-striped table-hover">
                  <thead className="thead-dark">
                    {
                      items ? (
                        <tr>
                          <th className="inventory-list-th">hostname</th>
                          <th className="inventory-list-th">mgmt_ip</th>
                          <th className="inventory-list-th">timestamp</th>
                          <th className="inventory-list-th">locked_by</th>
                          <th className="inventory-list-th">created_by</th>
                          <th className="inventory-list-th">valid</th>
                          <th className="inventory-list-th">device_type</th>
                          <th className="inventory-list-th">deployment_group</th>
                          <th className="inventory-list-th">expired</th>
                          <th className="inventory-list-th">id</th>
                          <th className="inventory-list-th">locked_bool</th>
                        </tr>
                      ) : null
                    }
                  </thead>
                  {
                    items ? (
                      <tbody>
                        {
                          items.map((row, index) => (
                            <tr key={index}>
                              <td>{row.hostname}</td>
                              <td>{row.mgmt_ip}</td>
                              <td>{row.timestamp}</td>
                              <td>{row.locked_by === null ? 'None' : row.locked_by}</td>
                              <td>{row.created_by}</td>
                              <td>{row.valid}</td>
                              <td>{row.device_type}</td>
                              <td>{row.deployment_group === null ? 'None' : row.deployment_group}</td>
                              <td>{row.expired}</td>
                              <td>{row.id}</td>
                              <td>{row.locked_bool}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    ) : null
                  }
              </table>
          </form>
        </div>
      </main>
    </React.Fragment>
  );
}

export default List;