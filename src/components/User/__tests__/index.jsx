import React from 'react';
import { shallow } from 'enzyme';
import NavBar from 'components/NavBar';
import { useUser } from 'store/store';
import User from '../index';
import Breadcrumbs from 'components/Breadcrumbs';

jest.mock('store/store');

//TODO: what is <style> at line no 27

describe('User', () => {


  //<editor-fold desc="Custom expects">
  const mockUser = {
    display_name: 'Steichen, Joelle',
    email: 'Joelle.Steichen1@T-Mobile.com',
    avatar: 'any url',
    first_name: ' a first name',
    last_name: 'a last name',
    username: 'a user name'
  };

  const logUser = (user) => {
    console.log(user.children().debug());
  }

  const expectBreadcrumbs = (user, expectedProps = [{ text: 'Home', path: '/' }]) => {
    expect(user.childAt(1).equals(<Breadcrumbs paths={expectedProps}/>)).toBeTruthy();
  };

  const expectNavBarAsFirstChild = (user) => {
    expect(user.childAt(0).equals(<NavBar />)).toBeTruthy();
  };

  const expectMainBlock = (user) => {
    const main = user.childAt(2);
    expect(main.type()).toEqual('main');
    expect(main.prop('role')).toEqual('main');
    expect(main.prop('id')).toEqual('main');
    expect(main.prop('className')).toEqual('container');
  };

  const expectJustifyContentDiv = (user) => {
    const main = user.childAt(2);
    const justfyContentDiv = main.childAt(1);
    expect(justfyContentDiv.type()).toEqual('div');
    expect(justfyContentDiv.prop('className')).toEqual('row justify-content-md-center');
  };

  const expectCardDiv = (user) => {
    const main = user.childAt(2);
    const cardDiv = main.childAt(1).children();
    expect(cardDiv.type()).toEqual('div');
    expect(cardDiv.prop('className')).toEqual('card');
  };

  const expectCardDivNotRendered = (user) => {
    const main = user.childAt(2);
    const justfyContentDiv = main.childAt(1);
    console.log(justfyContentDiv.debug())
    expect(justfyContentDiv.children().length).toBe(0);
  };

  const expectAvatar = (user) => {
    const main = user.childAt(2);
    const cardDiv = main.childAt(1).children();
    const cardHeader = cardDiv.childAt(0);
    const avatarDiv = cardHeader.childAt(0);
    const mockAvatarUrl = () => `url("${mockUser.avatar}")`;

    expect(cardHeader.type()).toEqual('div');
    expect(cardHeader.prop('className')).toEqual('card-header text-center');
    expect(avatarDiv.type()).toEqual('div');
    expect(avatarDiv.prop('className')).toEqual('user-img-shape');
    console.log(avatarDiv.prop('style'))
    expect(avatarDiv.prop('style')).toEqual({ backgroundImage: mockAvatarUrl() });
  };

  const expectUserName = (user) => {
    const main = user.childAt(2);
    const cardDiv = main.childAt(1).children();
    const cardBody = cardDiv.childAt(1);

    expect(cardBody.type()).toEqual('div');
    expect(cardBody.prop('className')).toEqual('card-body');
    expect(cardBody.childAt(0).equals(
      <ul>
        <strong>Username: </strong>
        {mockUser.username}
      </ul>
      )
    ).toBeTruthy();
  };

  const expectFirstName = (user) => {
    const cardBody = user.childAt(2).childAt(1).children().childAt(1);

    expect(cardBody.childAt(1).equals(
      <ul>
        <strong>First name: </strong>
        {mockUser.first_name}
      </ul>
      )
    ).toBeTruthy();
  };

  const expectLastName = (user) => {
    const cardBody = user.childAt(2).childAt(1).children().childAt(1);

    expect(cardBody.childAt(2).equals(
      <ul>
        <strong>Last name: </strong>
        {mockUser.last_name}
      </ul>
      )
    ).toBeTruthy();
  };

  const expectDisplayName = (user) => {
    const cardBody = user.childAt(2).childAt(1).children().childAt(1);

    expect(cardBody.childAt(3).equals(
      <ul>
        <strong>Display name: </strong>
        {mockUser.display_name}
      </ul>
      )
    ).toBeTruthy();
  };


  const expectEmail = (user) => {
    const cardBody = user.childAt(2).childAt(1).children().childAt(1);

    expect(cardBody.childAt(4).equals(
      <ul>
        <strong>Email: </strong>
        {mockUser.email}
      </ul>
      )
    ).toBeTruthy();
  };

  //</editor-fold>

  beforeEach(() => {
    useUser.mockReturnValue(null);
  });

  it('should render nav bar as first element', () => {
    const user = shallow(<User />);

    expectNavBarAsFirstChild(user);
  });

  it('should render Breadcrumbs', () => {
    const user = shallow(<User />);

    expectBreadcrumbs(user);
  });

  it('should render Breadcrumbs with user info when the user has logged in', () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectBreadcrumbs(user, [
      { text: 'Home', path: '/' },
      { text: `${mockUser.display_name}`, path: '/me' },
    ]);
  });

  it("should renter main block", () => {
    const user = shallow(<User />);

    expectMainBlock(user)
  });

  it("should renter a div inside main to justify content", () => {
    const user = shallow(<User />);

    expectJustifyContentDiv(user)
  });

  it("should render card div if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectCardDiv(user)
  });

  it("should not render card div if user has not logged in", () => {
    const user = shallow(<User />);

    expectCardDivNotRendered(user)
  });

  it("should render avatar if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectAvatar(user)
  });

  it("should render user name if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectUserName(user)
  });

  it("should render first name if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectFirstName(user)
  });


  it("should render last name if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectLastName(user)
  });

  it("should render display name if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectDisplayName(user)
  });

  it("should render email if user has logged in", () => {
    useUser.mockReturnValue(mockUser);

    const user = shallow(<User />);

    expectEmail(user)
  });

});
