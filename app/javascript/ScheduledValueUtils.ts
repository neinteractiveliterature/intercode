/* eslint-disable import/prefer-default-export */

import { DateTime } from 'luxon';

import Timespan from './Timespan';

export type TimespanWithValueGeneric<ValueType> = {
  start?: string,
  finish?: string,
  value: ValueType,
};

export type ScheduledValueGeneric<ValueType> = {
  timespans: TimespanWithValueGeneric<ValueType>[],
};

export function findTimespanIndexAt<ValueType>(
  scheduledValue: ScheduledValueGeneric<ValueType>,
  time: DateTime,
) {
  return scheduledValue.timespans.findIndex((timespanObj) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(time);
  });
}

export function findTimespanAt<ValueType>(
  scheduledValue: ScheduledValueGeneric<ValueType>,
  time: DateTime,
) {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return null;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt<ValueType>(
  scheduledValue: ScheduledValueGeneric<ValueType>,
  time: DateTime,
) {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex<ValueType>(
  scheduledValue: ScheduledValueGeneric<ValueType>,
) {
  return findTimespanIndexAt(scheduledValue, DateTime.local());
}

export function findCurrentTimespan<ValueType>(
  scheduledValue: ScheduledValueGeneric<ValueType>,
) {
  return findTimespanAt(scheduledValue, DateTime.local());
}

export function findCurrentValue<ValueType>(scheduledValue: ScheduledValueGeneric<ValueType>) {
  return findValueAt(scheduledValue, DateTime.local());
}
