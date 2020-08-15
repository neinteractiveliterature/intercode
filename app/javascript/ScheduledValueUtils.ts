/* eslint-disable import/prefer-default-export */

import moment, { MomentInput } from 'moment-timezone';
import Timespan from './Timespan';
import { ScheduledValue, ScheduledMoneyValue } from './graphqlTypes.generated';

type AnyScheduledValue = ScheduledValue | ScheduledMoneyValue;

export function findTimespanIndexAt<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
  time: MomentInput,
) {
  const timeMoment = moment(time);
  return scheduledValue.timespans.findIndex((timespanObj: ScheduledValueType['timespans'][0]) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(timeMoment);
  });
}

export function findTimespanAt<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
  time: MomentInput,
) {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return null;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
  time: MomentInput,
) {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
) {
  return findTimespanIndexAt(scheduledValue, moment());
}

export function findCurrentTimespan<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
) {
  return findTimespanAt(scheduledValue, moment());
}

export function findCurrentValue<ScheduledValueType extends AnyScheduledValue>(
  scheduledValue: Pick<ScheduledValueType, 'timespans'>,
) {
  return findValueAt(scheduledValue, moment());
}
