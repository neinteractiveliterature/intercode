import React from 'react';
import { shallow } from 'enzyme';
import ErrorDisplay from '../../app/javascript/ErrorDisplay';

test('it renders a string error', () => {
  const component = shallow(<ErrorDisplay stringError="everything is borked" />);

  expect(component.text()).toEqual('everything is borked');
});

test('it renders a graphql error', () => {
  const component = shallow(<ErrorDisplay
    graphQLError={{
      graphQLErrors: [
        { message: 'everything ' },
        { message: 'is borked' },
      ],
    }}
  />);

  expect(component.text()).toEqual('everything is borked');
});

test('it renders nothing by default', () => {
  const component = shallow(<ErrorDisplay />);

  expect(component.children().length).toEqual(0);
});
