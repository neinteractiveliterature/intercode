import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';

describe('BootstrapFormInput', () => {
  const onChange = sinon.spy();

  const component = shallow(<BootstrapFormInput
    name="my_checkbox"
    label="check me"
    value=""
    onChange={onChange}
  />);

  test('it passes change events', () => {
    component.find('input').simulate('change', { value: 'asdf' });
    expect(onChange.calledWith({ value: 'asdf' })).toBeTruthy();
  });
});
