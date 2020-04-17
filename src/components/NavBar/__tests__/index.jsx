import React from 'react';
import { shallow } from 'enzyme';
import NavBar from 'components/NavBar';
import GenIconImg from 'assets/img/gen_icon.png';
import InventoryNavBarLinks from 'components/features/inventory/InventoryNavBarLinks';
import WorkflowNavBarLinks from 'components/features/workflow/WorkflowNavBarLinks';
import AdminNavBarLinks from 'components/admin/AdminNavBarLinks';
import DashboardNavBarLinks from 'components/features/dashboard/DashboardNavBarLinks';
import ProdEnvImg from 'assets/img/production.png';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockLogout = jest.fn();
jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authService: ({ logout: mockLogout }),
  }),
}));

const mockUser = { display_name: 'Sajani', avatar: 'my-avatar' };
jest.mock('store/store', () => ({
  useUser: jest.fn(() => mockUser),
}));

describe('Nav Bar', () => {
  let navBar;
  beforeAll(() => {
    navBar = shallow(<NavBar />);
  });

  it('should render proteus beta logo', () => {
    const brand = navBar.find('a.navbar-brand');
    expect(brand.text().trim()).toEqual('Proteus BETA');

    const brandImage = brand.find('img');
    expect(brandImage.prop('src')).toEqual(GenIconImg);
    expect(brandImage.prop('width')).toEqual('30');
    expect(brandImage.prop('height')).toEqual('30');
    expect(brandImage.prop('alt')).toEqual('Da Gen');
  });

  it('should go to home on click of proteus beta logo', () => {
    const brand = navBar.find('a.navbar-brand');
    const mockPreventDefault = jest.fn();
    const mockAttribute = jest.fn();
    mockAttribute.mockReturnValueOnce('/');

    brand.simulate('click', {
      preventDefault: mockPreventDefault,
      currentTarget: { getAttribute: mockAttribute },
    });

    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });

  it('should render navbar toggler', () => {
    const navBarTogglerButton = navBar.childAt(1);

    expect(navBarTogglerButton.type()).toEqual('button');
    expect(navBarTogglerButton.prop('data-toggle')).toEqual('collapse');
    expect(navBarTogglerButton.prop('data-target')).toEqual('#navbarsExampleDefault');
  });

  it('should contain inventory, workflow, admin and dashboard links', () => {
    expect(navBar.childAt(2).equals(<InventoryNavBarLinks />)).toBeTruthy();
    expect(navBar.childAt(3).equals(<WorkflowNavBarLinks />)).toBeTruthy();
    expect(navBar.childAt(4).equals(<AdminNavBarLinks />)).toBeTruthy();
    expect(navBar.childAt(5).equals(<DashboardNavBarLinks />)).toBeTruthy();
  });

  it('should show environment info', () => {
    const environment = navBar.childAt(7);

    expect(environment.find('img').props()).toEqual({
      src: ProdEnvImg,
      width: '30',
      height: '30',
      className: 'd-inline-block align-top',
      alt: 'Da Gen',
    });
    expect(environment.text()).toEqual('test');
  });

  it('should display user\'s name and avatar', () => {
    const userInfo = navBar.childAt(8);
    const userAvatar = userInfo.find('img');

    expect(userInfo.find('span').text().trimEnd()).toEqual('Sajani');
    expect(userAvatar.prop('src')).toEqual('my-avatar');
    expect(userAvatar.prop('alt')).toEqual('avatar');
  });

  it('should display profile and logout in dropdown on click of user\'s name', () => {
    const userInfo = navBar.childAt(8);

    userInfo.find('button').first().simulate('click');

    const dropDown = userInfo.find('div.dropdown-menu');
    const profileLink = dropDown.childAt(0);
    const logoutLink = dropDown.childAt(2);
    expect(profileLink.text()).toEqual('Profile');
    expect(dropDown.childAt(1).equals(<div className="dropdown-divider" />)).toBeTruthy();
    expect(logoutLink.text()).toEqual('Logout');
  });

  it('should navigate to me on profile click', () => {
    const userInfo = navBar.childAt(8);
    userInfo.find('button').first().simulate('click');
    const profileLink = userInfo.find('div.dropdown-menu').childAt(0);
    profileLink.simulate('click');

    expect(mockHistoryPush).toHaveBeenCalledWith('/me');
  });

  it('should call auth service logout on logout click', () => {
    const userInfo = navBar.childAt(8);
    userInfo.find('button').first().simulate('click');
    const logoutLink = userInfo.find('div.dropdown-menu').childAt(2);
    logoutLink.simulate('click');

    expect(mockLogout).toHaveBeenCalledWith('/');
  });
});
