
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import NotFound from 'components/NotFound/NotFound';
import { useStateValue } from 'store/store';
import { useSnackbar } from "notistack";
import { showNotification } from 'utils/notifications';
import { useAuth } from 'store/auth-store'

import './styles.css';

const User = () => {
  let { username } = useParams();
  const [userNotFound, setUserNotFound] = React.useState(0);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const auth = useAuth();
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const checkAuth = async () => {
      setUser(await auth.getUser());
    };
    checkAuth();
  }, []);

  const getBreadcrumbsPath = () => {
    if (user) {
      return [
        { text: 'Home', path: '/'},
        { text: `${user.name}`, path: `/user/${user.preferred_username}`},
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
                  <ul><strong>Username: </strong>{user.preferred_username}</ul>
                  <ul><strong>First name: </strong>{user.given_name}</ul>
                  <ul><strong>Last name: </strong>{user.family_name}</ul>
                  <ul><strong>Display name: </strong>{user.name}</ul>
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