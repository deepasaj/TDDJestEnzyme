import React from 'react';
import { shallow } from 'enzyme';
import Add from 'components/features/inventory/Add';
import NavBar from 'components/NavBar';
import Breadcrumbs from 'components/Breadcrumbs';
import BulkUpload from 'components/features/inventory/Add/BulkUpload';

describe('Add', () => {
  let component;
  beforeAll(() => {
    component = shallow(<Add />);
  });

  it('should render navbar', () => {
    expect(component.childAt(0).equals(<NavBar />)).toBeTruthy();
  });

  it('should render breadcrumbs', () => {
    const expectedPaths = [
      { text: 'Home', path: '/' },
      { text: 'Inventory', path: '/inventory' },
      { text: 'Add Devices', path: '/inventory/add' },
    ];
    expect(component.childAt(1).type()).toEqual(Breadcrumbs);
    expect(component.childAt(1).props()).toEqual({ paths: expectedPaths });
  });

  it('should render main component with bulk upload', () => {
    const mainComponent = component.childAt(2);

    expect(mainComponent.type()).toEqual('main');
    expect(mainComponent.prop('role')).toEqual('main');
    expect(mainComponent.prop('id')).toEqual('main');
    expect(mainComponent.prop('className')).toEqual('container');
    const addDiv = mainComponent.childAt(0).find('div.Add');
    expect(addDiv.childAt(0).equals(<BulkUpload />)).toBeTruthy();
  });
});
