import React from 'react';
import ReactLoading from 'react-loading';
import { shallow } from 'enzyme';
import LoadingPage from 'components/LoadingPage';

describe('Loading Page', () => {
  it('should render the loading page', () => {
    const loadingPage = shallow(<LoadingPage />);

    const loadingComponent = loadingPage.childAt(0);
    expect(loadingComponent.type()).toEqual(ReactLoading);
    expect(loadingComponent.prop('type')).toEqual('cylon');
    expect(loadingComponent.prop('height')).toEqual(75);
    expect(loadingComponent.prop('width')).toEqual(75);
    expect(loadingPage.childAt(1).text()).toEqual(' Loading ');
  });
});
