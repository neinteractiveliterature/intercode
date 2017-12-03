import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BooleanInput from '../../../app/javascript/BuiltInFormControls/BooleanInput';
import MultipleChoiceInput from '../../../app/javascript/BuiltInFormControls/MultipleChoiceInput';

describe('BooleanInput', () => {
  const onChange = sinon.spy();
  const component = shallow(<BooleanInput
    caption="Is this a test?"
    onChange={onChange}
    value={false}
  />);

  test('it renders', () => {
    expect(component.find(MultipleChoiceInput).length).toEqual(1);
  });

  test('onChange correctly parses true boolean value', () => {
    component.find(MultipleChoiceInput).get(0).props.onChange('true');
    expect(onChange.calledWith(true)).toBeTruthy();
  });

  test('onChange correctly parses false boolean value', () => {
    component.find(MultipleChoiceInput).get(0).props.onChange('false');
    expect(onChange.calledWith(false)).toBeTruthy();
  });
});
