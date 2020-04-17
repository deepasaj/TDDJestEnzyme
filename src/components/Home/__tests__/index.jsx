import React from 'react';
import { shallow } from 'enzyme';
import HomePage from 'components/Home';
import NavBar from 'components/NavBar';
import ProteusMain from 'components/Home/Tabs';

describe('Home Page', () => {
  it('should render nav bar and proteus main', () => {
    const wrapperComponent = shallow(<HomePage />);

    expect(wrapperComponent.children()).toHaveLength(2);
    expect(wrapperComponent.childAt(0).equals(<NavBar />)).toBeTruthy();
    const mainContainer = wrapperComponent.childAt(1);
    expect(mainContainer.type()).toEqual('main');
    expect(mainContainer.prop('id')).toEqual('main');
    expect(mainContainer.prop('role')).toEqual('main');
    const homePageDiv = mainContainer.childAt(0);
    expect(homePageDiv.type()).toEqual('div');
    expect(homePageDiv.childAt(0).equals(<ProteusMain />)).toBeTruthy();
  });
});
