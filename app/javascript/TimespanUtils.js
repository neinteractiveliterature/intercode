import moment from 'moment-timezone';
import Timespan from './Timespan';

export function timespanFromConvention(convention) {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at)
    .tz(convention.timezone_name);
}

export function timespanFromRun(convention, event, run) {
  const start = moment(run.starts_at).tz(convention.timezone_name);
  const finish = start.clone().add(event.length_seconds, 'seconds');

  return new Timespan(start, finish);
}

export function getConventionDayTimespans(conventionTimespan, timezoneName) {
  return conventionTimespan.getTimespansWithin(
    timezoneName,
    'day',
    moment.duration(6, 'hours'), // start convention days at 6:00am
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
