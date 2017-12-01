import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from '../../app/javascript/LoadingIndicator';

test('it renders with a given size', () => {
  const component = shallow(<LoadingIndicator size={2} />);

  expect(component.find('.display-2').length).toEqual(1);
});

test('it renders with size 5 by default', () => {
  const component = shallow(<LoadingIndicator size={5} />);

  expect(component.find('.display-5').length).toEqual(1);
});
