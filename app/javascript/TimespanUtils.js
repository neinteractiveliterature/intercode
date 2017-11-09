import moment from 'moment-timezone';
import Timespan from './PCSG/Timespan';

export function timespanFromConvention(convention) {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at)
    .tz(convention.timezone_name);
}

export function timespanFromRun(convention, event, run) {
  const start = moment(run.starts_at).tz(convention.timezone_name);
  const finish = start.clone().add(event.length_seconds, 'seconds');

  return new Timespan(start, finish);
}
