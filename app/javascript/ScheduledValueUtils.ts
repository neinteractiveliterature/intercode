/* eslint-disable import/prefer-default-export */

import Timespan from './Timespan';

export type TypedScheduledValueTimespan<ValueType> = {
  start?: string | null;
  finish?: string | null;
  value: ValueType;
};

export type TypedScheduledValue<ValueType> = {
  timespans: TypedScheduledValueTimespan<ValueType>[];
};

export function findTimespanIndexAt(scheduledValue: TypedScheduledValue<any>, time: Date) {
  return scheduledValue.timespans.findIndex((timespanObj) => {
    // time zone doesn't actually matter here
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish, 'Etc/UTC');
    return timespan.includesTime(time);
  });
}

export function findTimespanAt<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
  time: Date,
) {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return null;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt<ValueType>(scheduledValue: TypedScheduledValue<ValueType>, time: Date) {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
) {
  return findTimespanIndexAt(scheduledValue, new Date());
}

export function findCurrentTimespan<ValueType>(scheduledValue: TypedScheduledValue<ValueType>) {
  return findTimespanAt(scheduledValue, new Date());
}

export function findCurrentValue<ValueType>(scheduledValue: TypedScheduledValue<ValueType>) {
  return findValueAt(scheduledValue, new Date());
}
