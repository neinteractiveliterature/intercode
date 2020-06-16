import React from 'react';
import { DateTime } from 'luxon';

import { render, fireEvent } from '../testUtils';
import ScheduledValueTimespanRowDatepicker from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRowDatepicker';

describe('ScheduledValueTimespanRowDatepicker', () => {
  const timespan = { nonsense: DateTime.fromISO('1970-01-01T01:02:03Z').setZone('Etc/UTC').toISO({ includeOffset: true }) };

  const renderScheduledValueTimespanRowDatepicker = (props) => render(
    <ScheduledValueTimespanRowDatepicker
      fieldName="nonsense"
      value={null}
      validateDate={() => true}
      timezoneName="UTC"
      timespan={timespan}
      rowAttributeDidChange={() => {}}
      {...props}
    />,
  );

  test('it renders with a value', () => {
    const { getByLabelText } = renderScheduledValueTimespanRowDatepicker();
    expect(getByLabelText('Date')).toHaveValue('1970-01-01');
    expect(getByLabelText('Time')).toHaveValue('01:02:03');
  });

  test('changing date', () => {
    const rowAttributeDidChange = jest.fn();
    const { getByLabelText } = renderScheduledValueTimespanRowDatepicker({ rowAttributeDidChange });
    fireEvent.change(getByLabelText('Date'), { target: { value: '1999-12-31' } });
    expect(rowAttributeDidChange).toHaveBeenCalledWith('nonsense', '1999-12-31T01:02:03.000Z');
  });

  test('changing time', () => {
    const rowAttributeDidChange = jest.fn();
    const { getByLabelText } = renderScheduledValueTimespanRowDatepicker({ rowAttributeDidChange });
    fireEvent.change(getByLabelText('Time'), { target: { value: '23:59:59' } });
    expect(rowAttributeDidChange).toHaveBeenCalledWith('nonsense', '1970-01-01T23:59:59.000Z');
  });
});
