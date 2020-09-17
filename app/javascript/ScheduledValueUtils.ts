/* eslint-disable import/prefer-default-export */

import moment, { MomentInput } from 'moment-timezone';
import Timespan from './Timespan';
import { ScheduledValue, ScheduledMoneyValue } from './graphqlTypes.generated';

export type TypedScheduledValueTimespan<ValueType> = {
  start?: string | null;
  finish?: string | null;
  value: ValueType;
};

export type TypedScheduledValue<ValueType> = {
  timespans: TypedScheduledValueTimespan<ValueType>[];
};

type AnyScheduledValue = ScheduledValue | ScheduledMoneyValue;

export function findTimespanIndexAt(scheduledValue: TypedScheduledValue<any>, time: MomentInput) {
  const timeMoment = moment(time);
  return scheduledValue.timespans.findIndex((timespanObj) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(timeMoment);
  });
}

export function findTimespanAt<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
  time: MomentInput,
) {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return null;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
  time: MomentInput,
) {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
) {
  return findTimespanIndexAt(scheduledValue, moment());
}

export function findCurrentTimespan<ValueType>(scheduledValue: TypedScheduledValue<ValueType>) {
  return findTimespanAt(scheduledValue, moment());
}

export function findCurrentValue<ValueType>(scheduledValue: TypedScheduledValue<ValueType>) {
  return findValueAt(scheduledValue, moment());
}
