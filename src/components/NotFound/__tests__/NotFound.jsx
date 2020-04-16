import React from 'react';
import { shallow } from 'enzyme';
import NotFound from 'components/NotFound/NotFound';
import NotFoundImg from 'assets/img/sad-panda-404.jpg';
import Link from '@material-ui/core/Link';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Not Found', () => {
  it('should render the header', () => {
    const notFound = shallow(<NotFound />);

    const rootDiv = notFound.childAt(0);
    expect(rootDiv.hasClass('NotFound')).toBeTruthy();
    expect(rootDiv.childAt(1).type()).toEqual('p');
  });

  it('should show default message if no message is passed', () => {
    const notFound = shallow(<NotFound />);

    const defaultMessage = '404 Not Found: The requested URL was not found on the server. '
      + 'If you entered the URL manually please check your spelling and try again.';
    expect(notFound.find('div').childAt(1).text()).toEqual(defaultMessage);
  });

  it('should show message if message is passed as props', () => {
    const message = 'Message!';
    const notFound = shallow(<NotFound message={message} />);

    expect(notFound.find('div').childAt(1).text()).toEqual(message);
  });

  it('should render link to home screen', () => {
    const notFound = shallow(<NotFound />);

    const linkToHomePage = notFound.find('div').childAt(2);
    expect(linkToHomePage.type()).toEqual(Link);
    expect(linkToHomePage.prop('component')).toEqual('button');
  });

  it('should call history push on link click', () => {
    const notFound = shallow(<NotFound />);

    const linkToHomePage = notFound.find('div').childAt(2);
    linkToHomePage.simulate('click');
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should render not found image', () => {
    const notFound = shallow(<NotFound />);

    const image = notFound.find('div').childAt(3).find('img');
    expect(image.prop('src')).toEqual(NotFoundImg);
    expect(image.prop('alt')).toEqual('Not found panda');
  });
});
