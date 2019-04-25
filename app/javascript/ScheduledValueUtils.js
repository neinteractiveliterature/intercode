/* eslint-disable import/prefer-default-export */

import moment from 'moment-timezone';
import Timespan from './Timespan';

export function findCurrentValue(scheduledValue) {
  const now = moment();
  const currentTimespan = scheduledValue.timespans.find((timespanObj) => {
    const timespan = Timespan.fromStrings(timespanObj.start, timespanObj.finish);
    return timespan.includesTime(now);
  });

  if (!currentTimespan) {
    return null;
  }

  return currentTimespan.value;
}
