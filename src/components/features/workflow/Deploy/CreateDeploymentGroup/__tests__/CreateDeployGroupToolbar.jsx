import { shallow } from 'enzyme';
import React from 'react';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Toolbar from 'components/features/workflow/Deploy/CreateDeploymentGroup/CreateDeployGroupToolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Toolbar', () => {
  let createDeploymentGroupToolbar;
  let tooltip;
  let iconButton;

  beforeEach(() => {
    createDeploymentGroupToolbar = shallow(<Toolbar />);
    tooltip = createDeploymentGroupToolbar.childAt(0);
    iconButton = tooltip.childAt(0);
  });

  it('should render tool tip with title', () => {
    expect(tooltip.type()).toEqual(Tooltip);
    expect(tooltip.prop('title')).toEqual('View Deployment Groups');
  });

  it('should show icon button', () => {
    expect(iconButton.type()).toEqual(IconButton);
    expect(iconButton.prop('aria-label')).toEqual('delete');
  });

  it('should go to deployment_groups on click show icon button', () => {
    iconButton.simulate('click');

    expect(mockHistoryPush).toHaveBeenCalledWith('/workflow/deploy/deployment_groups');
  });

  it('should show ListAltIcon', () => {
    expect(iconButton.childAt(0).type()).toEqual(ListAltIcon);
  });
});
