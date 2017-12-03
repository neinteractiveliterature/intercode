import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import BootstrapFormTextarea from '../../../app/javascript/BuiltInFormControls/BootstrapFormTextarea';

describe('BootstrapFormTextarea', () => {
  const onChange = sinon.spy();

  const component = shallow(<BootstrapFormTextarea
    name="my_checkbox"
    label="check me"
    value=""
    onChange={onChange}
  />);

  test('it passes change events', () => {
    component.find('textarea').simulate('change', { value: 'asdf' });
    expect(onChange.calledWith({ value: 'asdf' })).toBeTruthy();
  });
});
