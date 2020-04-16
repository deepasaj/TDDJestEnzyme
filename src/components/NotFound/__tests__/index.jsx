import React from 'react';
import { shallow } from 'enzyme';
import NotFoundPage from '../NotFound';

describe('Not Found', () => {
  it('should render not found page', () => {
    const notFoundPage = shallow(<NotFoundPage />);

    expect(notFoundPage.childAt(0)).toEqual('NavBar');
  });
});
