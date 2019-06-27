import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import DateTimeInput from '../../../app/javascript/BuiltInFormControls/DateTimeInput';
import ScheduledValueTimespanRowDatepicker from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRowDatepicker';

describe('ScheduledValueTimespanRowDatepicker', () => {
  const timespan = { nonsense: moment.tz({}, 'UTC').toISOString(true) };

  const renderScheduledValueTimespanRowDatepicker = props => shallow(
    <ScheduledValueTimespanRowDatepicker
      fieldName="nonsense"
      value={null}
      validateDate={() => true}
      timezoneName="UTC"
      timespan={timespan}
      {...props}
    />,
  );

  test('it renders with a value', () => {
    const component = renderScheduledValueTimespanRowDatepicker();
    expect(component.find(DateTimeInput).prop('value')).toEqual(timespan.nonsense);
  });

  test('onChange', () => {
    const rowAttributeDidChange = jest.fn();
    const newValue = moment().toISOString();
    const component = renderScheduledValueTimespanRowDatepicker({ rowAttributeDidChange });
    component.find(DateTimeInput).prop('onChange')(newValue);
    expect(rowAttributeDidChange).toHaveBeenCalledWith('nonsense', newValue);
  });
});
