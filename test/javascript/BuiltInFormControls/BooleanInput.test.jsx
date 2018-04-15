import React from 'react';
import { shallow } from 'enzyme';
import BooleanInput from '../../../app/javascript/BuiltInFormControls/BooleanInput';
import MultipleChoiceInput from '../../../app/javascript/BuiltInFormControls/MultipleChoiceInput';

describe('BooleanInput', () => {
  const onChange = jest.fn();
  const component = shallow(<BooleanInput
    caption="Is this a test?"
    onChange={onChange}
    value={false}
  />);

  beforeEach(onChange.mockReset);

  test('it renders', () => {
    expect(component.find(MultipleChoiceInput).length).toEqual(1);
  });

  test('onChange correctly parses true boolean value', () => {
    component.find(MultipleChoiceInput).get(0).props.onChange('true');
    expect(onChange.mock.calls[0][0]).toBeTruthy();
  });

  test('onChange correctly parses false boolean value', () => {
    component.find(MultipleChoiceInput).get(0).props.onChange('false');
    expect(onChange.mock.calls[0][0]).toBeFalsy();
  });
});
