import React from 'react';
import { shallow } from 'enzyme';
import BootstrapFormTextarea from '../../../app/javascript/BuiltInFormControls/BootstrapFormTextarea';

describe('BootstrapFormTextarea', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const component = shallow(<BootstrapFormTextarea
    name="my_checkbox"
    label="check me"
    value=""
    onChange={onChange}
  />);

  test('it passes change events', () => {
    component.find('textarea').simulate('change', { value: 'asdf' });
    expect(onChange.mock.calls[0][0]).toEqual({ value: 'asdf' });
  });
});
