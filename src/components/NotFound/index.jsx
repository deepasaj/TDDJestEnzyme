import React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import NavBar from 'components/NavBar';
import NotFound from './NotFound';

const NotFoundPage = () => {
  const breadcrumbsPath = [
    { text: 'Home', path: '/' },
  ];
  return (
    <>
      <NavBar />
      <Breadcrumbs paths={breadcrumbsPath} />
      <NotFound />
    </>
  );
};

export default NotFoundPage;
