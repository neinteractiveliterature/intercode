/* eslint-disable import/prefer-default-export */

import moment from 'moment-timezone';
import Timespan from './Timespan';

export function findTimespanIndexAt(scheduledValue, time) {
  const timeMoment = moment(time);
  return scheduledValue.timespans.findIndex((timespanObj) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(timeMoment);
  });
}

export function findTimespanAt(scheduledValue, time) {
  const index = findTimespanIndexAt(scheduledValue, time);
  if (index === -1) {
    return null;
  }
  return scheduledValue.timespans[index];
}

export function findValueAt(scheduledValue, time) {
  const timespan = findTimespanAt(scheduledValue, time);
  return timespan?.value;
}

export function findCurrentTimespanIndex(scheduledValue) {
  return findTimespanIndexAt(scheduledValue, moment());
}

export function findCurrentTimespan(scheduledValue) {
  return findTimespanAt(scheduledValue, moment());
}

export function findCurrentValue(scheduledValue) {
  return findValueAt(scheduledValue, moment());
}
