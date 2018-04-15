import React from 'react';
import { shallow } from 'enzyme';
import ChoiceSet from '../../../app/javascript/BuiltInFormControls/ChoiceSet';
import MultipleChoiceInput from '../../../app/javascript/BuiltInFormControls/MultipleChoiceInput';

describe('MultipleChoiceInput', () => {
  const renderMultipleChoiceInput = props => shallow(<MultipleChoiceInput
    name="pickSomething"
    onChange={() => {}}
    choices={[
      { label: 'a', value: '1' },
      { label: 'b', value: '2' },
      { label: 'c', value: '3' },
    ]}
    caption="Hello there"
    {...props}
  />);

  test('it renders the caption', () => {
    const component = renderMultipleChoiceInput();
    expect(component.find('legend').text()).toEqual('Hello there');
  });

  test('it renders a ChoiceSet', () => {
    const component = renderMultipleChoiceInput();
    expect(component.find(ChoiceSet).length).toEqual(1);
  });
});
