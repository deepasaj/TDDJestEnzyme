import React from 'react';
import { NODE_ENV } from 'config';
import { useHistory } from 'react-router-dom';
import { useUser } from 'store/store';
import InventoryNavBarLinks from 'components/features/inventory/InventoryNavBarLinks'
import WorkflowNavBarLinks from 'components/features/workflow/WorkflowNavBarLinks'
import DashboardNavBarLinks from 'components/features/dashboard/DashboardNavBarLinks'
import AdminNavBarLinks from 'components/admin/AdminNavBarLinks'
import { useOktaAuth } from '@okta/okta-react';

import GenIconImg from 'assets/img/gen_icon.png';
import DevEnvImg from 'assets/img/development.png';
import ProdEnvImg from 'assets/img/production.png';

function NavBar(props) {
  const history = useHistory();
  const { authService } = useOktaAuth();
  const user = useUser()


  function logout() {
    authService.logout('/');
  }

  const clickHandler = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href')
    if (href) history.push(href);
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <a className="navbar-brand" href="/" onClick={clickHandler}>
        <img src={GenIconImg} width="30" height="30" className="d-inline-block align-top" alt="Da Gen" />
        &nbsp;Proteus <i style={{ fontSize: '.75em' }}>BETA</i>
      </a>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
        aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <InventoryNavBarLinks />
      <WorkflowNavBarLinks />
      <DashboardNavBarLinks />
      <AdminNavBarLinks />

      <div className="navbar-collapse" />

      <div>
        <img src={NODE_ENV === 'development' ? DevEnvImg : ProdEnvImg} width="30" height="30" className="d-inline-block align-top" alt="Da Gen" />
        <span className="navbar-text" style={{ paddingRight: '50px', paddingTop: '5px' }}>&nbsp;{NODE_ENV}</span>
      </div>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle" type="button" id="userDropDown"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
        >
          <img src={user.avatar} style={{ borderRadius: '5px', width: 32, height: 32 }} />
          <span style={{ paddingLeft: '10px' }}>{user.display_name}&nbsp;</span>
        </button>
        <div className="dropdown-menu" aria-labelledby="userDropDown">
          <a
            className="dropdown-item"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/me`)}
          >
            Profile
          </a>
          <div className="dropdown-divider"></div>
          <a
            className="dropdown-item"
            style={{ cursor: 'pointer' }}
            onClick={logout}
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
