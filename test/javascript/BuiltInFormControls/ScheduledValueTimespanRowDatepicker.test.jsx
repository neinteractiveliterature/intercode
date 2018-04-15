import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import DateTimeInput from '../../../app/javascript/BuiltInFormControls/DateTimeInput';
import ScheduledValueTimespanRowDatepicker from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRowDatepicker';

describe('ScheduledValueTimespanRowDatepicker', () => {
  const onChange = jest.fn();
  beforeEach(onChange.mockReset);

  const renderScheduledValueTimespanRowDatepicker = props =>
    (shallow(<ScheduledValueTimespanRowDatepicker
      fieldName="nonsense"
      value={null}
      onChange={onChange}
      validateDate={() => true}
      timezoneName="UTC"
      {...props}
    />));

  test('it renders with a value', () => {
    const value = moment().toISOString();
    const component = renderScheduledValueTimespanRowDatepicker({ value });
    expect(component.find(DateTimeInput).prop('value')).toEqual(value);
  });

  test('onChange', () => {
    const newValue = moment().toISOString();
    const component = renderScheduledValueTimespanRowDatepicker();
    component.find(DateTimeInput).prop('onChange')(newValue);
    expect(onChange).toHaveBeenCalledWith('nonsense', newValue);
  });
});
