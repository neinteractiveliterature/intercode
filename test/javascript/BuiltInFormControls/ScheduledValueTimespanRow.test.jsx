import React from 'react';

import { render, fireEvent } from '../testUtils';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueTimespanRow, { scheduledValueTimespanIsValid } from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';

describe('ScheduledValueTimespanRow', () => {
  const attributeDidChange = jest.fn();
  const deleteClicked = jest.fn();

  const timespanStart = '2017-01-01T00:00:00Z';
  const timespanFinish = '2017-01-02T00:00:00Z';

  beforeEach(() => {
    attributeDidChange.mockReset();
    deleteClicked.mockReset();
  });

  const renderScheduledValueTimespanRow = (props, timespanProps) => {
    const timespan = {
      start: timespanStart,
      finish: timespanFinish,
      value: '',
      ...timespanProps,
    };

    return render((
      <table>
        <tbody>
          <ScheduledValueTimespanRow
            buildInput={buildTestScheduledValueInput}
            rowIdentifier={42}
            timespan={timespan}
            otherTimespans={[]}
            timezone="UTC"
            attributeDidChange={attributeDidChange}
            deleteClicked={deleteClicked}
            {...props}
          />
        </tbody>
      </table>
    ));
  };

  test('it renders with a value', () => {
    const value = 'blooblah';
    const { getByTestId } = renderScheduledValueTimespanRow({}, { value });
    expect(getByTestId('testInput')).toHaveValue(value);
  });

  test('changing value', () => {
    const { getByTestId } = renderScheduledValueTimespanRow();
    fireEvent.change(getByTestId('testInput'), { target: { value: 'newvalue' } });
    expect(attributeDidChange).toHaveBeenCalledWith(42, 'value', 'newvalue');
  });

  describe('isValid', () => {
    test('it requires a value', () => {
      expect(scheduledValueTimespanIsValid({})).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: null })).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: 6 })).toBeTruthy();
    });

    test('it does not require a start or a finish', () => {
      expect(scheduledValueTimespanIsValid({
        value: 6,
        start: null,
        finish: null,
      })).toBeTruthy();
    });
  });
});
