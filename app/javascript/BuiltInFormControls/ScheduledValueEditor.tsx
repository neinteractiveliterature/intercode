import { useCallback } from 'react';
import * as React from 'react';
import maxBy from 'lodash/maxBy';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import ScheduledValueTimespanRow, { scheduledValueTimespanIsValid } from './ScheduledValueTimespanRow';

export type EditingTimespan<ValueType> = {
  start?: string | null;
  finish?: string | null;
  value: ValueType | undefined;
};

export type EditingScheduledValue<ValueType> = {
  timespans: EditingTimespan<ValueType>[];
};

export function scheduledValueIsValid(scheduledValue: Partial<EditingScheduledValue<unknown>>): boolean {
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

function addTimespanToScheduledValue<ValueType, ScheduledValueType extends EditingScheduledValue<ValueType>>(
  scheduledValue: ScheduledValueType,
) {
  const newTimespans = [...(scheduledValue.timespans || [])];
  const lastTimespan = maxBy(newTimespans, (timespan) =>
    timespan.finish ? DateTime.fromISO(timespan.finish).toMillis() : 0,
  );
  const everyTimespanFinishes = newTimespans.every((timespan) => timespan.finish);

  let startTime: string | undefined;
  if (lastTimespan && lastTimespan.finish && everyTimespanFinishes) {
    startTime = lastTimespan.finish;
  }

  newTimespans.push({ start: startTime, finish: undefined, value: undefined });

  return { ...scheduledValue, timespans: newTimespans };
}

function sortTimespans<ValueType>(timespans: EditingTimespan<ValueType>[]): EditingTimespan<ValueType>[] {
  const sortedNewTimespans = sortBy(timespans, (timespan) => {
    if (timespan.finish) {
      return DateTime.fromISO(timespan.finish).toMillis();
    }

    // undefined finish means forever
    return Number.MAX_SAFE_INTEGER;
  });

  return sortedNewTimespans;
}

function deleteTimespan<ValueType>(
  timespans: EditingTimespan<ValueType>[],
  index: number,
): EditingTimespan<ValueType>[] {
  const newTimespans = timespans.slice(0, index).concat(timespans.slice(index + 1));
  const nextTimespan = newTimespans[index];
  if (nextTimespan) {
    // extend the next timespan's start time to fill in the gap left by deleting this timespan
    newTimespans[index] = { ...nextTimespan, start: newTimespans[index - 1]?.finish };
  }

  return sortTimespans(newTimespans);
}

function updateTimespanFinish<ValueType>(
  timespans: EditingTimespan<ValueType>[],
  index: number,
  newFinish: string | undefined,
): EditingTimespan<ValueType>[] {
  const newTimespans = timespans.map((timespan, i) => {
    if (i === index) {
      return { ...timespan, finish: newFinish };
    }
    if (i === index + 1) {
      return { ...timespan, start: newFinish };
    }
    return timespan;
  });

  // don't reorder if the user cleared out the finish; they are probably mid-edit
  if (newFinish == null) {
    return newTimespans;
  }

  return sortTimespans(newTimespans);
}

type AddTimespanAction = {
  type: 'addTimespan';
};

type DeleteTimespanAction = {
  type: 'deleteTimespan';
  index: number;
};

type UpdateTimespanValueAction<ValueType> = {
  type: 'updateTimespanValue';
  index: number;
  value: React.SetStateAction<ValueType | null | undefined> | null | undefined;
};

type UpdateTimespanFinishAction = {
  type: 'updateTimespanFinish';
  index: number;
  finish: React.SetStateAction<string | null | undefined> | null | undefined;
};

export type ScheduledValueReducerAction<ValueType> =
  | AddTimespanAction
  | DeleteTimespanAction
  | UpdateTimespanValueAction<ValueType>
  | UpdateTimespanFinishAction;

export function scheduledValueReducer<ValueType, ScheduledValueType extends EditingScheduledValue<ValueType>>(
  state: ScheduledValueType,
  action: ScheduledValueReducerAction<ValueType>,
): ScheduledValueType {
  switch (action.type) {
    case 'addTimespan':
      return addTimespanToScheduledValue(state);
    case 'deleteTimespan':
      return {
        ...state,
        timespans: deleteTimespan(state.timespans, action.index),
      };
    case 'updateTimespanValue':
      return {
        ...state,
        timespans: state.timespans.map((timespan, index) => {
          if (index === action.index) {
            if (typeof action.value === 'function') {
              return {
                ...timespan,
                value: (action.value as (prev: ValueType | undefined) => ValueType | undefined)(timespan.value),
              };
            } else {
              return { ...timespan, value: action.value };
            }
          }

          return timespan;
        }),
      };
    case 'updateTimespanFinish':
      return {
        ...state,
        timespans: updateTimespanFinish(
          state.timespans,
          action.index,
          calculateNewFinish<ValueType, ScheduledValueType>(action, state),
        ),
      };
    default:
      return state;
  }
}

export type ScheduledValueEditorProps<ValueType> = {
  scheduledValue: EditingScheduledValue<ValueType>;
  timezone: string;
  dispatch: (action: ScheduledValueReducerAction<ValueType>) => void;
  buildValueInput: (value: ValueType | undefined, onChange: React.Dispatch<ValueType | undefined>) => JSX.Element;
};

function calculateNewFinish<ValueType, ScheduledValueType extends EditingScheduledValue<ValueType>>(
  action: UpdateTimespanFinishAction,
  state: ScheduledValueType,
) {
  let newFinish: string | undefined;
  if (typeof action.finish === 'function') {
    newFinish = action.finish(state.timespans[action.index].finish) ?? undefined;
  } else {
    newFinish = action.finish ?? undefined;
  }
  return newFinish;
}

function ScheduledValueEditor<ValueType>({
  scheduledValue,
  timezone,
  dispatch,
  buildValueInput,
}: ScheduledValueEditorProps<ValueType>): JSX.Element {
  const addRowClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({ type: 'addTimespan' });
  };

  const deleteRowClicked = (index: number) => {
    dispatch({ type: 'deleteTimespan', index });
  };

  const timespanFinishDidChange = useCallback(
    (index: number, finish: string | undefined) => dispatch({ type: 'updateTimespanFinish', index, finish }),
    [dispatch],
  );

  const valueDidChange = useCallback(
    (index: number, value: ValueType | undefined) => dispatch({ type: 'updateTimespanValue', index, value }),
    [dispatch],
  );

  const timespans = scheduledValue.timespans || [];

  const timespanRows = timespans.map((timespan, i) => (
    <ScheduledValueTimespanRow
      timespan={timespan}
      timezone={timezone}
      key={`${i}-${timespan.start}-${timespan.finish}`}
      rowIdentifier={i}
      deleteClicked={deleteRowClicked}
      finishDidChange={timespanFinishDidChange}
      valueDidChange={valueDidChange}
      buildInput={buildValueInput}
      isLastTimespan={i === timespans.length - 1}
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
