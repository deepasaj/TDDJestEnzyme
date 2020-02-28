import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import ProteusMain from "./Tabs";

import './styles.css';

const HomePage = () => {
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