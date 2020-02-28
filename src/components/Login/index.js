import React, { useState, useEffect } from "react";
import { useLogin } from 'hooks/authentication';
import { NODE_ENV, VERSION } from 'config';

import './styles.css';

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, authError, login] = useLogin();
  const { history, location } = props;

  useEffect(() => {
    if (isAuthenticated) {
      const { from } = location.state || {from: {pathname: "/"}};
      history.push(from);
    }
  }, [isAuthenticated]);

  function handleSubmit(event) {
    event.preventDefault();
    login(username, password);
  }

  return (
    <React.Fragment>
      <main id="main" role="main" className="container">
        <div className="d-flex justify-content-center">
          <form id="login" className="form-control login-form" onSubmit={handleSubmit}>
            <div className="loginTop">
              <span className="float-left badge badge-primary">{NODE_ENV}</span>
              <span className="float-right badge badge-primary">v{VERSION}</span>
            </div>
            <div className="text-center">
              <h3>Proteus</h3>
            </div>
            <hr />
            <p>
              <label htmlFor="username">Username</label><br />
              <input
                className="form-control"
                id="username" name="username"
                required size="32"
                type="text" value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <br />
            </p>
            <p>
              <label htmlFor="password">Password</label><br />
              <input
                className="form-control"
                id="password" name="password"
                required size="32"
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <br />
            </p>
            <div className="text-center">
              <span className="loginError">{authError}</span>
            </div>
            <div className="text-center">
              <input className="btn btn-primary" id="submit" name="submit" type="submit" value="Sign In" />
            </div>
          </form>
        </div>
      </main>
      <div className="fill bg1"></div>
    </React.Fragment>
  );
}

export default Login;