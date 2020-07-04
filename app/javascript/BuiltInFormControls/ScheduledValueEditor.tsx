import React, { useCallback, ReactNode } from 'react';
import maxBy from 'lodash/maxBy';
import { assertNever } from 'assert-never';

import { DateTime } from 'luxon';
import ScheduledValueTimespanRow, { scheduledValueTimespanIsValid } from './ScheduledValueTimespanRow';
import { ScheduledValueGeneric, TimespanWithValueGeneric } from '../ScheduledValueUtils';

export type EditingTimespanWithValue<ValueType> = TimespanWithValueGeneric<ValueType | undefined>;
export type EditingScheduledValue<ValueType> = ScheduledValueGeneric<ValueType | undefined>;

export function scheduledValueIsValid<ValueType>(
  scheduledValue: EditingScheduledValue<ValueType>,
): scheduledValue is ScheduledValueGeneric<ValueType> {
  if (!scheduledValue.timespans || scheduledValue.timespans.length < 1) {
    return false;
  }

  return scheduledValue.timespans.every((timespan) => {
    if (!scheduledValueTimespanIsValid(timespan)) {
      return false;
    }

    return true;
  });
}

function addTimespanToScheduledValue<ValueType>(scheduledValue: EditingScheduledValue<ValueType>) {
  const newTimespans: EditingTimespanWithValue<ValueType>[] = [
    ...(scheduledValue.timespans || []),
  ];
  const lastTimespan = maxBy(newTimespans, (timespan) => (
    timespan.finish ? DateTime.fromISO(timespan.finish).valueOf() : 0));
  const everyTimespanFinishes = newTimespans.every((timespan) => timespan.finish);

  let startTime: string | undefined;
  if (lastTimespan && everyTimespanFinishes) {
    startTime = lastTimespan.finish!;
  }

  newTimespans.push({ start: startTime, finish: undefined, value: undefined });

  return { ...scheduledValue, timespans: newTimespans };
}

function updateScheduledValueTimespan<ValueType>(
  scheduledValue: EditingScheduledValue<ValueType>,
  index: number,
  updater: (timespan: EditingTimespanWithValue<ValueType>) => EditingTimespanWithValue<ValueType>,
): EditingScheduledValue<ValueType> {
  const newTimespans = [...scheduledValue.timespans];
  newTimespans[index] = updater(newTimespans[index]);
  return { ...scheduledValue, timespans: newTimespans };
}

export type ScheduledValueAddTimespanAction = {
  type: 'addTimespan',
};

export type ScheduledValueDeleteTimespanAction = {
  type: 'deleteTimespan',
  index: number,
};

export type ScheduledValueUpdateTimespanFieldAction<ValueType> = {
  type: 'updateTimespanField',
  index: number,
  value: ValueType,
  field: 'start' | 'finish',
};

export type ScheduledValueAction<ValueType> = (
  ScheduledValueAddTimespanAction |
  ScheduledValueDeleteTimespanAction |
  ScheduledValueUpdateTimespanFieldAction<ValueType>
);

export function scheduledValueReducer<ValueType>(
  state: EditingScheduledValue<ValueType>, action: ScheduledValueAction<ValueType>,
): EditingScheduledValue<ValueType> {
  switch (action.type) {
    case 'addTimespan':
      return addTimespanToScheduledValue(state);
    case 'deleteTimespan':
      return {
        ...state,
        timespans: state.timespans.slice(0, action.index)
          .concat(state.timespans.slice(action.index + 1)),
      };
    case 'updateTimespanField':
      return updateScheduledValueTimespan(
        state,
        action.index,
        (timespan) => ({ ...timespan, [action.field]: action.value }),
      );
    default:
      return assertNever(action);
  }
}

export type ScheduledValueEditorProps<ValueType> = {
  scheduledValue: EditingScheduledValue<ValueType>,
  timezone: string,
  dispatch: React.Dispatch<ScheduledValueAction<ValueType>>,
  buildValueInput: (value: ValueType, valueChanged: (newValue: ValueType) => void) => ReactNode,
};

function ScheduledValueEditor<ValueType>({
  scheduledValue, timezone, dispatch, buildValueInput,
}: ScheduledValueEditorProps<ValueType>) {
  const addRowClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'addTimespan' });
  };

  const deleteRowClicked = (index: number) => {
    dispatch({ type: 'deleteTimespan', index });
  };

  const timespanAttributeDidChange = useCallback(
    (index: number, field: 'start' | 'finish', value: ValueType) => dispatch({
      type: 'updateTimespanField', index, field, value,
    }),
    [dispatch],
  );

  const timespans = scheduledValue.timespans || [];

  const timespanRows = timespans.map((timespan, i) => (
    <ScheduledValueTimespanRow
      timespan={timespan}
      timezone={timezone}
      key={i} // eslint-disable-line react/no-array-index-key
      rowIdentifier={i}
      deleteClicked={deleteRowClicked}
      attributeDidChange={timespanAttributeDidChange}
      buildInput={buildValueInput}
    />
  ));

  return (
    <table className="table table-striped">
      <tbody>
        {timespanRows}
        <tr>
          <td colSpan={4}>
            <button className="btn btn-link" onClick={addRowClicked} type="button">
              Add row
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ScheduledValueEditor;
