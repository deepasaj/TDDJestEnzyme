import React from 'react';
import { shallow } from 'enzyme';
import NotFoundPage from 'components/NotFound';
import NavBar from 'components/NavBar';
import Breadcrumbs from 'components/Breadcrumbs';
import NotFound from 'components/NotFound/NotFound';

describe('Not Found Page', () => {
  it('should render NavBar, Breadcrumbs and NotFound components as children', () => {
    const notFoundPage = shallow(<NotFoundPage />);

    expect(notFoundPage.children()).toHaveLength(3);
    expect(notFoundPage.childAt(0).equals(<NavBar />)).toBeTruthy();
    const expectedPath = [{ text: 'Home', path: '/' }];
    expect(notFoundPage.childAt(1).equals(<Breadcrumbs paths={expectedPath} />)).toBeTruthy();
    expect(notFoundPage.childAt(2).equals(<NotFound />)).toBeTruthy();
  });
});
