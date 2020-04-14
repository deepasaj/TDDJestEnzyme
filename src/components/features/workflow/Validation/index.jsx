import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import Validation from './Validation';

import './styles.css';

const ValidationPage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
    { text: 'Device Validation', path: '/validation' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <main id="main" role="main" className="ValidationPage">
        <div className="">
          <Validation />
        </div>
      </main>
    </>
  );
};

export default ValidationPage;
