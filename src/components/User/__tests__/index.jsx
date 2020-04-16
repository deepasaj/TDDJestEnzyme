import React from 'react';
import { shallow } from 'enzyme';
import NavBar from 'components/NavBar';
import { useUser } from 'store/store';
import User from '../index';
import Breadcrumbs from 'components/Breadcrumbs';

jest.mock('store/store');


describe('User', () => {
  const mockUser = {
    display_name: 'Steichen, Joelle',
    email: 'Joelle.Steichen1@T-Mobile.com',
  };

  const logUser = (user) => {
    console.log(user.children().debug());
  }

  const expectBreadcrumbsAsSecondChild = (user, props = [{ text: 'Home', path: '/' }]) => {
    expect(user.childAt(1).equals(<Breadcrumbs paths={props}/>)).toBeTruthy();
  };

  const expectNavBarAsFirstChild = (user) => {
    expect(user.childAt(0).equals(<NavBar />)).toBeTruthy();
  };

  it('should render nav bar as first element', () => {
    const user = shallow(<User />);
    expectNavBarAsFirstChild(user);
  });

  it('should render Breadcrumbs after NavBar', () => {
    // useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectNavBarAsFirstChild(user);
    expectBreadcrumbsAsSecondChild(user);
  });

  it('should render Breadcrumbs after NavBar with user info when the user has logged in', () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectNavBarAsFirstChild(user);
    expectBreadcrumbsAsSecondChild(user, [
      { text: 'Home', path: '/' },
      { text: `${mockUser.display_name}`, path: '/me' },
    ]);
  });

});
