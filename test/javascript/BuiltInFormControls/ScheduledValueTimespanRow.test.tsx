import React from 'react';

import { render, fireEvent } from '../testUtils';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueTimespanRow, {
  scheduledValueTimespanIsValid,
  ScheduledValueTimespanRowProps,
} from '../../../app/javascript/BuiltInFormControls/ScheduledValueTimespanRow';
import { EditingTimespan } from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';

describe('ScheduledValueTimespanRow', () => {
  const attributeDidChange = jest.fn();
  const valueDidChange = jest.fn();
  const deleteClicked = jest.fn();

  const timespanStart = '2017-01-01T00:00:00Z';
  const timespanFinish = '2017-01-02T00:00:00Z';

  beforeEach(() => {
    attributeDidChange.mockReset();
    valueDidChange.mockReset();
    deleteClicked.mockReset();
  });

  const renderScheduledValueTimespanRow = (
    props: Partial<ScheduledValueTimespanRowProps<string | number>> = {},
    timespanProps: Partial<EditingTimespan<string | number>> = {},
  ) => {
    const timespan = {
      start: timespanStart,
      finish: timespanFinish,
      value: '',
      ...timespanProps,
    };

    return render(
      <table>
        <tbody>
          <ScheduledValueTimespanRow
            buildInput={buildTestScheduledValueInput}
            rowIdentifier={42}
            timespan={timespan}
            timezone="UTC"
            attributeDidChange={attributeDidChange}
            valueDidChange={valueDidChange}
            deleteClicked={deleteClicked}
            {...props}
          />
        </tbody>
      </table>,
    );
  };

  test('it renders with a value', () => {
    const value = 'blooblah';
    const { getByTestId } = renderScheduledValueTimespanRow({}, { value });
    expect(getByTestId('testInput')).toHaveValue(value);
  });

  test('changing value', () => {
    const { getByTestId } = renderScheduledValueTimespanRow();
    fireEvent.change(getByTestId('testInput'), { target: { value: 'newvalue' } });
    expect(valueDidChange).toHaveBeenCalledWith(42, 'newvalue');
  });

  describe('isValid', () => {
    test('it requires a value', () => {
      expect(scheduledValueTimespanIsValid({})).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: null })).toBeFalsy();
      expect(scheduledValueTimespanIsValid({ value: 6 })).toBeTruthy();
    });

    test('it does not require a start or a finish', () => {
      expect(
        scheduledValueTimespanIsValid({
          value: 6,
          start: null,
          finish: null,
        }),
      ).toBeTruthy();
    });
  });
});
