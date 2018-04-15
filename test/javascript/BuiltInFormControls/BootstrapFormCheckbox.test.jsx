import React from 'react';
import { shallow } from 'enzyme';
import BootstrapFormCheckbox from '../../../app/javascript/BuiltInFormControls/BootstrapFormCheckbox';

describe('BootstrapFormCheckbox', () => {
  const onChange = jest.fn();

  const component = shallow(<BootstrapFormCheckbox
    name="my_checkbox"
    label="check me"
    checked={false}
    onChange={onChange}
  />);

  beforeEach(onChange.mockReset);

  test('it passes change events', () => {
    component.find('input').simulate('change', { checked: true });
    expect(onChange.mock.calls[0][0]).toEqual({ checked: true });
  });

  test('it defaults to rendering as a checkbox', () => {
    expect(component.find('input').prop('type')).toEqual('checkbox');
  });

  test('it will also render as a radio button', () => {
    const radioComponent = shallow(<BootstrapFormCheckbox
      name="my_checkbox"
      label="check me"
      type="radio"
      checked={false}
      onChange={onChange}
    />);

    expect(radioComponent.find('input').prop('type')).toEqual('radio');
  });
});
