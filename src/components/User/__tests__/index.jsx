import React from 'react';
import { shallow } from 'enzyme';
import NavBar from 'components/NavBar';
import User from '../index';

describe('User', () => {
  const expectNavBarAsFirstChild = (user) => {
    console.log(user.children().debug())
    expect(user.childAt(0).equals(<NavBar />)).toBeTruthy();
  };

  it('should render nav bar as first element', () => {
    const user = shallow(<User />);

    expectNavBarAsFirstChild(user);
  });
});
