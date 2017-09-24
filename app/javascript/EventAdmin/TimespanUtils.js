// @flow

import moment from 'moment';
import Timespan from '../PCSG/Timespan';

export function timespanFromConvention(
  convention: { starts_at: string, ends_at: string, timezone_name: string},
): Timespan {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at)
    .tz(convention.timezone_name);
}

export function timespanFromRun(
  convention: { timezone_name: string },
  event: { length_seconds: number },
  run: { starts_at: string, },
): Timespan {
  const start = moment(run.starts_at).tz(convention.timezone_name);
  const finish = start.clone().add(event.length_seconds, 'seconds');

  return new Timespan(start, finish);
}
