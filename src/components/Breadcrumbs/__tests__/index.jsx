import React from 'react';
import { shallow } from 'enzyme';
import Breadcrumbs from 'components/Breadcrumbs';

describe('Breadcrumbs', () => {
  const expectRootElementToBeDivWithClassName = (breadcrumb) => {
    expect(breadcrumb.type()).toEqual('div');
    expect(breadcrumb.hasClass('Breadcrumbs')).toBeTruthy();
  };

  it('should not display breadcrumb when there are no paths', () => {
    const breadcrumb = shallow(<Breadcrumbs paths={[]} />);

    expectRootElementToBeDivWithClassName(breadcrumb);
    expect(breadcrumb.children().exists()).toBeFalsy();
    expect(breadcrumb.text()).toEqual('');
  });

  it('should display breadcrumb with links to each path', () => {
    const paths = [
      { text: 'Home', path: '/' },
      { text: 'Inventory', path: '/inventory' },
    ];

    const breadcrumb = shallow(<Breadcrumbs paths={paths} />);

    expectRootElementToBeDivWithClassName(breadcrumb);
    expect(breadcrumb.text()).toEqual('Home > Inventory');
    const children = breadcrumb.children();
    expect(children).toHaveLength(2);
    expect(children.at(0).find('Link').props()).toEqual({ to: '/', children: 'Home' });
    expect(children.at(1).find('Link').props()).toEqual({ to: '/inventory', children: 'Inventory' });
  });
});
