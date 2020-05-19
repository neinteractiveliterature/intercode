import moment from 'moment-timezone';
import Timespan from './Timespan';
import { timezoneNameForConvention } from './TimeUtils';

export function timespanFromConvention(convention) {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at)
    .tz(timezoneNameForConvention(convention));
}

export function timespanFromRun(convention, event, run) {
  const start = moment(run.starts_at).tz(timezoneNameForConvention(convention));
  const finish = start.clone().add(event.length_seconds, 'seconds');

  return new Timespan(start, finish);
}

export function getConventionDayTimespans(conventionTimespan, timezoneName) {
  return conventionTimespan.getTimespansWithin(
    timezoneName,
    {
      unit: 'day',
      offset: moment.duration(6, 'hours'), // start convention days at 6:00am
    },
  );
}

export function getMemoizationKeyForTimespan(timespan) {
  if (!timespan) {
    return '';
  }

  return [
    timespan.start ? timespan.start.toISOString() : '',
    timespan.finish ? timespan.finish.toISOString() : '',
  ].join('/');
}
