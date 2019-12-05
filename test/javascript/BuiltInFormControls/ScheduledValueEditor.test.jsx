import React from 'react';
import moment from 'moment';

import { render, fireEvent } from '../testUtils';
import buildTestScheduledValueInput from './buildTestScheduledValueInput';
import ScheduledValueEditor, { scheduledValueIsValid } from '../../../app/javascript/BuiltInFormControls/ScheduledValueEditor';

describe('ScheduledValueEditor', () => {
  const renderScheduledValueEditor = (props) => render((
    <ScheduledValueEditor
      scheduledValue={{ timespans: [] }}
      timezone="UTC"
      dispatch={() => {}}
      buildValueInput={buildTestScheduledValueInput}
      {...props}
    />
  ));

  test('it renders the correct values', () => {
    const cutoff = moment();
    const { getAllByRole, getAllByTestId } = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 1, start: null, finish: cutoff.toISOString() },
          { value: 2, start: cutoff.toISOString(), finish: null },
        ],
      },
    });

    // two value rows plus a footer
    expect(getAllByRole('row')).toHaveLength(3);
    expect(getAllByTestId('testInput').map((input) => input.value)).toEqual(['1', '2']);
  });

  test('adding a row', () => {
    const dispatch = jest.fn();
    const { getByText } = renderScheduledValueEditor({ dispatch });
    fireEvent.click(getByText('Add row'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'addTimespan' });
  });

  test('deleting a row', () => {
    const dispatch = jest.fn();
    const { getByText } = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 'something', start: null, finish: null },
        ],
      },
      dispatch,
    });
    fireEvent.click(getByText('Delete timespan'));
    expect(dispatch).toHaveBeenCalledWith({ type: 'deleteTimespan', index: 0 });
  });

  test('changing something in a row', () => {
    const dispatch = jest.fn();
    const { getByTestId } = renderScheduledValueEditor({
      scheduledValue: {
        timespans: [
          { value: 'something', start: null, finish: null },
        ],
      },
      dispatch,
    });
    fireEvent.change(getByTestId('testInput'), { target: { value: 'something else' } });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'updateTimespanField',
      index: 0,
      field: 'value',
      value: 'something else',
    });
  });

  describe('scheduledValueIsValid', () => {
    test('it requires at least one timespan', () => {
      expect(scheduledValueIsValid({ timespans: null })).toBeFalsy();
      expect(scheduledValueIsValid({ timespans: [] })).toBeFalsy();
      expect(scheduledValueIsValid({})).toBeFalsy();
    });

    test('it requires every timespan have a value', () => {
      expect(scheduledValueIsValid({
        timespans: [{ start: null, finish: null, value: null }],
      })).toBeFalsy();

      expect(scheduledValueIsValid({
        timespans: [
          { start: null, finish: null, value: null },
          { start: null, finish: null, value: 6 },
        ],
      })).toBeFalsy();
    });

    test('it passes if every timespan has a value', () => {
      expect(scheduledValueIsValid({
        timespans: [
          { start: null, finish: null, value: 6 },
        ],
      })).toBeTruthy();
    });
  });
});
