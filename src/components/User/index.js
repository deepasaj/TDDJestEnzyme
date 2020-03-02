
import React, { useEffect } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import { useUser } from 'store/store'

import './styles.css';

const User = () => {

  const user = useUser();
  console.log(user);
  const getBreadcrumbsPath = () => {
    if (user) {
      return [
        { text: 'Home', path: '/'},
        { text: `${user.name}`, path: `/user/me`},
      ];
    }
    return [{ text: 'Home', path: '/'}];
  }

  const avatarURL = () => {
    return `url("${user.avatar}")`;
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
                    style={{ backgroundImage: avatarURL()}}
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
          
        </div>
      </main>
    </React.Fragment>
  );
}

export default User;