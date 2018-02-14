import React from 'react';
import { shallow, mount } from 'enzyme';
import GraphQLQueryResultWrapper from '../../app/javascript/GraphQLQueryResultWrapper';
import LoadingIndicator from '../../app/javascript/LoadingIndicator';

const PureComponent = () => (<div>Hello world</div>);
const WrappedComponent = GraphQLQueryResultWrapper(PureComponent);

test('it renders a loading indicator if loading is true', () => {
  const component = shallow(<WrappedComponent data={{ loading: true }} />);

  expect(component.find(LoadingIndicator).length).toEqual(1);
});

test('it renders an error message if error is non-null', () => {
  const component = mount(<WrappedComponent
    data={{ loading: false, error: { message: 'blah' } }}
  />);

  expect(component.find('ErrorDisplay')).toHaveLength(1);
  expect(component.text()).toEqual('blah');
});

test('it renders the component if everything is happy', () => {
  const component = shallow(<WrappedComponent
    data={{ loading: false, error: null }}
  />);

  expect(component.find(PureComponent).length).toEqual(1);
});
