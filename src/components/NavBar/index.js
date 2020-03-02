import React, { useEffect, useState } from 'react';
import { NODE_ENV } from 'config';
import { withRouter } from 'react-router-dom';
import { useAuth } from 'store/auth-store';;

import GenIconImg from 'assets/img/gen_icon.png';
import DevEnvImg from 'assets/img/development.png';
import ProdEnvImg from 'assets/img/production.png';

function NavBar(props) {
  const { history } = props;
  const auth = useAuth();

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  useEffect(() => {
    const checkAuth = async () => {
      console.log(await auth.getUser());
      setAuthenticated(await auth.isAuthenticated());
      setUser((await auth.getUser()) || {});
    };
    checkAuth();
  }, []);
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a className="navbar-brand" href="/">
            <img src={GenIconImg} width="30" height="30" className="d-inline-block align-top" alt="Da Gen" />
            &nbsp;Proteus <i style={{fontSize: '.75em'}}>BETA</i>
        </a>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="dropdown" style={{paddingRight: '2px'}}>
            <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
               Inventory&nbsp;
            </button>
            <div className="dropdown-menu" aria-labelledby="userDropDown">
                <a className="dropdown-item" href="/inventory/bulk">Bulk Add Devices</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/inventory/manage">View/Manage Inventory</a>
            </div>
        </div>
         <div className="dropdown" style={{paddingRight: '2px'}}>
            <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
               Deployments&nbsp;
            </button>
            <div className="dropdown-menu" aria-labelledby="userDropDown">
                <a className="dropdown-item" href="/deploy/group/create">Create Deployment Group</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/deploy/deployment_groups">Manage Deployment Groups</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/job">View/Manage Jobs</a>
            </div>
        </div>
         <div className="dropdown" style={{paddingRight: '2px'}}>
            <button className="btn btn-secondary-quicklinks dropdown-toggle" type="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
               Validation&nbsp;
            </button>
            <div className="dropdown-menu" aria-labelledby="userDropDown">
                <a className="dropdown-item" href="/validation">Request Device Report</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/job?workflow_type=DA+Validation">View/Manage Device Reports</a>
            </div>
        </div>

        {
          isAuthenticated ? (
            <React.Fragment>
              <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                  <ul className="navbar-nav mr-auto">
                      <li className="nav-item">
                          <a className="nav-link" href="/dashboard">Dashboard</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <img src={NODE_ENV === 'development' ? DevEnvImg : ProdEnvImg} width="30" height="30" className="d-inline-block align-top" alt="Da Gen" />
                  <span className="navbar-text" style={{paddingRight: '50px', paddingTop: '5px'}}>&nbsp;{NODE_ENV}</span>
              </div>
              <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle" type="button" id="userDropDown"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                   >
                      <img src={user.avatar} style={{borderRadius: '5px'}} />
                      <span style={{paddingLeft: '10px'}}>{user.name}&nbsp;</span>
                  </button>
                  <div className="dropdown-menu" aria-labelledby="userDropDown">
                      <a
                        className="dropdown-item"
                        style={{cursor: 'pointer'}}
                        onClick={() => history.push(`/user/me`)}
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        style={{cursor: 'pointer'}}
                        onClick={() => logout()}
                      >
                        Logout
                      </a>
                  </div>
              </div>
            </React.Fragment>
              ) : null
        }
    </nav>
  );
}

export default withRouter(NavBar);
