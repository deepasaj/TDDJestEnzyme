import { shallow } from 'enzyme';
import React, { useState as useStateMock }from 'react';

import ToolbarSelect from 'components/features/workflow/Deploy/CreateDeploymentGroup/DeploymentGroupCustomToolbarSelect';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import TitlePopUp from '../TitleDialog';


const aGroupId = "a group id";
const mockSetGroupId = jest.fn();
const mockDisplayData = ['22','11'];
const mockSelectedRows = { data: [ { dataIndex: 0 }, { dataIndex: 1 } ] };

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('DeploymentGroupCustomToolbarSelect', () => {

  let toolbarSelect
  let toolTip
  let iconButton
  const setStateMock = jest.fn();

  beforeEach(() => {
    useStateMock.mockImplementation(init => [init, setStateMock]);

    toolbarSelect = shallow(
      <ToolbarSelect
        groupId={ aGroupId }
        setGroupId={ mockSetGroupId }
        displayData={ mockDisplayData }
        selectedRows={ mockSelectedRows }
      />)
    toolTip = toolbarSelect.childAt(0).childAt(0);
    iconButton = toolTip.childAt(0)
  })

  it('shoud render icon container', () => {
    expect(toolbarSelect.childAt(0).type()).toEqual('div')
    // expect(toolbarSelect.childAt(0).prop('className')).toEqual('mocked-iconContainer-class')
  })

  it('shoud render Tooltip with title', () => {
    expect(toolTip.type()).toEqual(Tooltip);
    expect(toolTip.prop('title')).toEqual('Create Deployment Group');
  })

  it('shoud render group work icon', () => {
    expect(iconButton.type()).toEqual(IconButton);
    expect(iconButton.childAt(0).type()).toEqual(GroupWorkIcon);
  })

  it('shoud update showSetTitle on click of work icon', () => {
    iconButton.simulate('click');

    expect(setStateMock).toHaveBeenCalledWith(true);

  })

  it('shoud render TitlePopUp ', () => {
    const titlePopup = toolbarSelect.childAt(1);

    expect(titlePopup.type()).toEqual(TitlePopUp)
    expect(titlePopup.prop('showSetTitle')).toEqual(false)
    expect(titlePopup.prop('setShowSetTitle')).toEqual(setStateMock)
    expect(titlePopup.prop('groupId')).toEqual(aGroupId)
    expect(titlePopup.prop('selectedRows')).toEqual(mockSelectedRows)
    expect(titlePopup.prop('displayData')).toEqual(mockDisplayData)
    expect(titlePopup.prop('setGroupId')).toEqual(mockSetGroupId)
  })


});
