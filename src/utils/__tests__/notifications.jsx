import { mount } from 'enzyme';
import { showNotification } from 'utils/notifications';
import Button from '@material-ui/core/Button';

describe('notifications', () => {
  const message = 'message';
  const variant = 'error';
  const mockShowMethod = jest.fn();
  const mockCloseMethod = jest.fn();

  beforeAll(() => {
    showNotification(message, variant, mockShowMethod, mockCloseMethod);
  });

  it('should call show method with message as first param', () => {
    expect(mockShowMethod).toHaveBeenCalledTimes(1);
    const argumentsOfShowMethod = mockShowMethod.mock.calls[0];
    expect(argumentsOfShowMethod[0]).toEqual(message);
  });

  it('should validate the second params of show method', () => {
    const argumentsOfShowMethod = mockShowMethod.mock.calls[0];
    const showOptions = argumentsOfShowMethod[1];
    expect(showOptions.variant).toEqual(variant);
    expect(showOptions.anchorOrigin).toEqual({
      vertical: 'bottom',
      horizontal: 'right',
    });
    expect(showOptions.persist).toBeTruthy();
  });

  it('should render button on action call', () => {
    const argumentsOfShowMethod = mockShowMethod.mock.calls[0];
    const showOptions = argumentsOfShowMethod[1];
    const action = mount(showOptions.action('someKey'));
    expect(action.find(Button).text()).toEqual('Dismiss');
  });

  it('should call close method on click of dismiss button on action call', () => {
    const argumentsOfShowMethod = mockShowMethod.mock.calls[0];
    const showOptions = argumentsOfShowMethod[1];
    const action = mount(showOptions.action('someKey'));
    action.find(Button).simulate('click');

    expect(mockCloseMethod).toHaveBeenCalledWith('someKey');
  });
});
