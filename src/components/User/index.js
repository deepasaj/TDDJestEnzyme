import axios from "axios";
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from 'config';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import NotFound from 'components/NotFound/NotFound';
import { getAuthHeader } from 'utils/auth';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuthAPI } from 'store/auth-store'

import './styles.css';

const User = () => {
  let { username } = useParams();
  const [user, setUser] = React.useState(0);
  const [userNotFound, setUserNotFound] = React.useState(0);
  const [state] = useStateValue();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const authAPI = useAuthAPI();
  
  useEffect(() => {
    authAPI.get(`${API_URL}/user/get_user/${username}`, { timeout:5000 })
      .then(resp => {
        setUser(resp.data.data);
      })
      .catch(error => {
        if (error.response.status === 404) {
          setUserNotFound(true);
        } else {
          showNotification("There was an error contacting the database. Please contact administrator.", 'error', enqueueSnackbar, closeSnackbar);
        }
      });
    }, []);

  const getBreadcrumbsPath = () => {
    if (user) {
      return [
        { text: 'Home', path: '/'},
        { text: `${user.username}`, path: `/user/${user.username}`},
      ];
    }
    return [{ text: 'Home', path: '/'}];
  }

  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={getBreadcrumbsPath()} />
      <main id="main" role="main" className="container">
        <style>
        </style>
        <div className="row justify-content-md-center">
          {user ? (
            <div className="card">
                <div className="card-header text-center">
                  <div
                    className="user-img-shape"
                    style={{ backgroundImage: `url(${user.avatar})`}}
                  ></div>
                </div>
                <div className="card-body">
                  <ul><strong>Username: </strong>{user.username}</ul>
                  <ul><strong>First name: </strong>{user.first_name}</ul>
                  <ul><strong>Last name: </strong>{user.last_name}</ul>
                  <ul><strong>Display name: </strong>{user.display_name}</ul>
                  <ul><strong>Email: </strong>{user.email}</ul>
                </div>
            </div>
            ) : null
          }
          {userNotFound ? <NotFound /> : null}
        </div>
      </main>
    </React.Fragment>
  );
}

export default User;