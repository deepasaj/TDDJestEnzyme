import React from 'react';
import { shallow } from 'enzyme';
import ProteusMain from 'components/Home/Tabs';
import HomeTab from 'components/Home/Home';
import ApplicationTab from 'components/Home/Applications';

describe('Proteus Main', () => {
  it('should render home and application tabs', () => {
    const wrapperComponent = shallow(<ProteusMain />);

    expect(wrapperComponent.children()).toHaveLength(2);
    expect(wrapperComponent.childAt(0).equals(<HomeTab />)).toBeTruthy();
    expect(wrapperComponent.childAt(1).equals(<ApplicationTab />)).toBeTruthy();
  });
});
