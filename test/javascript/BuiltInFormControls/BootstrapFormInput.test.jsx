import React from 'react';
import { shallow } from 'enzyme';
import BootstrapFormInput from '../../../app/javascript/BuiltInFormControls/BootstrapFormInput';

describe('BootstrapFormInput', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const component = shallow(<BootstrapFormInput
    name="my_checkbox"
    label="check me"
    value=""
    onChange={onChange}
  />);

  test('it passes change events', () => {
    component.find('input').simulate('change', { value: 'asdf' });
    expect(onChange.mock.calls[0][0]).toEqual({ value: 'asdf' });
  });
});
