import React from 'react';
import { shallow } from 'enzyme';
import Grid from '@material-ui/core/Grid';
import InventoryStatCards from 'components/features/inventory/InventoryStatCards';
import WorkflowStatCards from 'components/features/workflow/WorkflowStatCards';
import HomeTab from 'components/Home/Home';

describe('Home Tab', () => {
  it('should render home tab', () => {
    const wrapperComponent = shallow(<HomeTab />);

    expect(wrapperComponent.type()).toEqual('div');
    const grid = wrapperComponent.childAt(0);
    expect(grid.type()).toEqual(Grid);
    expect(grid.prop('spacing')).toEqual(2);
    expect(grid.children()).toHaveLength(2);
    expect(grid.childAt(0).equals(<InventoryStatCards />)).toBeTruthy();
    expect(grid.childAt(1).equals(<WorkflowStatCards />)).toBeTruthy();
  });
});
