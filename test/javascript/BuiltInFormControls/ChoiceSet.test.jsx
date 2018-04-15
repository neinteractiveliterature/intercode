import React from 'react';
import { mount } from 'enzyme';
import ChoiceSet from '../../../app/javascript/BuiltInFormControls/ChoiceSet';

describe('ChoiceSet', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const renderChoiceSet = props => mount(<ChoiceSet
    name="pickSomething"
    onChange={onChange}
    choices={[
      { label: 'a', value: '1' },
      { label: 'b', value: '2' },
      { label: 'c', value: '3' },
    ]}
    {...props}
  />);

  test('it renders the choices given', () => {
    const component = renderChoiceSet();
    expect(component.find('input').length).toEqual(3);
  });

  test('by default it renders radio buttons', () => {
    const component = renderChoiceSet();
    expect(component.find('input').filter({ type: 'radio' }).length).toEqual(3);
  });

  test('the value is selected', () => {
    const component = renderChoiceSet({ value: '2' });
    expect(component.find('input').filter({ checked: true }).map(input => input.prop('value'))).toEqual(['2']);
  });

  test('it calls onChange when a new value is selected', () => {
    const component = renderChoiceSet();
    component.find('input').filter({ value: '3' }).simulate('change');
    expect(onChange.mock.calls[0][0]).toEqual('3');
  });

  describe('multiple', () => {
    test('it renders checkboxes', () => {
      const component = renderChoiceSet({ multiple: true });
      expect(component.find('input').filter({ type: 'checkbox' }).length).toEqual(3);
    });

    test('the values are selected', () => {
      const component = renderChoiceSet({ multiple: true, value: ['2', '3'] });
      expect(component.find('input').filter({ checked: true }).map(input => input.prop('value'))).toEqual(['2', '3']);
    });

    test('it calls onChange when a new value is selected', () => {
      const component = renderChoiceSet({ multiple: true, value: ['1'] });
      component.find('input').filter({ value: '3' }).simulate('change', { target: { checked: true, value: '3' } });
      expect(onChange.mock.calls[0][0]).toEqual(['1', '3']);
    });

    test('it calls onChange when an old value is deselected', () => {
      const component = renderChoiceSet({ multiple: true, value: ['1'] });
      component.find('input').filter({ value: '1' }).simulate('change', { target: { checked: false, value: '1' } });
      expect(onChange.mock.calls[0][0]).toEqual([]);
    });
  });
});
