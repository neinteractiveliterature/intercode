import { DateTime } from 'luxon';
import Timespan from './Timespan';

export type TypedScheduledValueTimespan<ValueType> = {
  start?: string | null;
  finish?: string | null;
  value: ValueType;
};

export type TypedScheduledValue<ValueType> = {
  timespans: TypedScheduledValueTimespan<ValueType>[];
};

export function findTimespanIndexAt(
  scheduledValue: TypedScheduledValue<unknown>,
  time: DateTime,
): number {
  return scheduledValue.timespans.findIndex((timespanObj) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(time);
  });
}

export function findTimespanAt<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
  time: DateTime,
): TypedScheduledValue<ValueType>['timespans'][number] | undefined {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return undefined;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
  time: DateTime,
): ValueType | undefined {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
): number {
  return findTimespanIndexAt(scheduledValue, DateTime.local());
}

export function findCurrentTimespan<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
): TypedScheduledValue<ValueType>['timespans'][number] | undefined {
  return findTimespanAt(scheduledValue, DateTime.local());
}

export function findCurrentValue<ValueType>(
  scheduledValue: TypedScheduledValue<ValueType>,
): ValueType | undefined {
  return findValueAt(scheduledValue, DateTime.local());
}
