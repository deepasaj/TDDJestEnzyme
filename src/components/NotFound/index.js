import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import NotFound from './NotFound';

const NotFoundPage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/'},
  ];
  return (
    <React.Fragment>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
        <NotFound />
      </React.Fragment>
    );
}

export default NotFoundPage;