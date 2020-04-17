import React from 'react';
import { shallow } from 'enzyme';
import ApplicationTab from 'components/Home/Applications';
import Grid from '@material-ui/core/Grid';
import InventoryHomeCards from 'components/features/inventory/InventoryHomeCards';
import WorkflowHomeCards from 'components/features/workflow/WorkflowHomeCards';
import DashboardHomeCards from 'components/features/dashboard/DashboardHomeCards';

describe('Application Tab', () => {
  it('should render inventory, workflow and dashboard home cards', () => {
    const wrapperComponent = shallow(<ApplicationTab />);

    expect(wrapperComponent.type()).toEqual('div');
    const grid = wrapperComponent.childAt(0);
    expect(grid.type()).toEqual(Grid);
    expect(grid.prop('spacing')).toEqual(4);
    expect(grid.children()).toHaveLength(3);
    expect(grid.childAt(0).type()).toEqual(InventoryHomeCards);
    expect(grid.childAt(1).type()).toEqual(WorkflowHomeCards);
    expect(grid.childAt(2).type()).toEqual(DashboardHomeCards);
  });
});
