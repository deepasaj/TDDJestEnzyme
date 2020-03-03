import React, { useEffect } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import ProteusMain from "./Tabs";
import { useAuth, useStateValue, useAuthAPI } from 'store/store';
import './styles.css';

const HomePage = () => {

    const auth = useAuth();
    const authAPI = useAuthAPI();
    const [state, dispatch] = useStateValue();

    useEffect(() => {
      // check for authentication
      const checkAuthentication = async () => {
        if (!state.isAuthenticated) {
          const user = (await authAPI.get('/auth/me')).data;
          user.avatar = `https://ui-avatars.com/api/?rounded=true&name=${user.display_name}`
          return dispatch({
            type: "AUTHENTICATED",
            payload: user
          });
        }
        /*
        const authenticated = await auth.isAuthenticated();
        if (!state.isAuthenticated && authenticated) {
          // detected the authenticated
          const user = (await authAPI.get('/auth/me')).data;
          user.avatar = `https://ui-avatars.com/api/?rounded=true&name=${user.display_name}`
          return dispatch({
            type: "AUTHENTICATED",
            payload: user
          });
        }*/
      };
      checkAuthentication();
    });

    return (
      <React.Fragment>
        <NavBar />
        <Breadcrumbs />
        <main id="main" role="main" className="container">
          <div className="HomePage">
            <ProteusMain />
          </div>
        </main>
      </React.Fragment>
    );
}

export default HomePage;