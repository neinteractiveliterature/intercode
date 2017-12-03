import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BootstrapFormCheckbox from '../../../app/javascript/BuiltInFormControls/BootstrapFormCheckbox';

describe('BootstrapFormCheckbox', () => {
  const onChange = sinon.spy();

  const component = shallow(<BootstrapFormCheckbox
    name="my_checkbox"
    label="check me"
    checked={false}
    onChange={onChange}
  />);

  test('it passes change events', () => {
    component.find('input').simulate('change', { checked: true });
    expect(onChange.calledWith({ checked: true })).toBeTruthy();
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
