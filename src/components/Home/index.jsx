import React from 'react';
import NavBar from 'components/NavBar';
import ProteusMain from './Tabs';
import './styles.css';

const HomePage = () => (
  <>
    <NavBar />
    <main id="main" role="main" className="container">
      <div className="HomePage">
        <ProteusMain />
      </div>
    </main>
  </>
);

export default HomePage;
