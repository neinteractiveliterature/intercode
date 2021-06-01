import { removeCommonStringMiddle } from '@neinteractiveliterature/litform';

import { DateTime, Duration } from 'luxon';
import Timespan, { FiniteTimespan } from './Timespan';
import { timezoneNameForConvention } from './TimeUtils';
import { Convention, Event, Run } from './graphqlTypes.generated';

export type ConventionForTimespanUtils = Pick<
  Convention,
  'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'
>;

export function timespanFromConvention(convention: ConventionForTimespanUtils) {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at).tz(
    timezoneNameForConvention(convention),
  );
}

export function timespanFromRun(
  timezoneName: string,
  event: Pick<Event, 'length_seconds'>,
  run: Pick<Run, 'starts_at'>,
) {
  const start = DateTime.fromISO(run.starts_at).setZone(timezoneName);
  const finish = start.plus({ seconds: event.length_seconds });

  return Timespan.finiteFromDateTimes(start, finish);
}

export function getConventionDayTimespans(
  conventionTimespan: FiniteTimespan,
  timezoneName: string,
) {
  return conventionTimespan.getTimespansWithin(timezoneName, {
    unit: 'day',
    offset: Duration.fromObject({ hours: 6 }), // start convention days at 6:00am
  });
}

export function getMemoizationKeyForTimespan(timespan?: Timespan) {
  if (!timespan) {
    return '';
  }

  return [
    timespan.start ? timespan.start.toISO() : '',
    timespan.finish ? timespan.finish.toISO() : '',
  ].join('/');
}

export function describeInterval(
  timespan: Timespan,
  formatDateTime: (dateTime: DateTime) => string,
  timeZone: string,
) {
  const start = timespan.start ? formatDateTime(timespan.start.setZone(timeZone)) : 'anytime';

  const finish = timespan.finish
    ? formatDateTime(timespan.finish.setZone(timeZone))
    : 'indefinitely';

  const [dedupedStart, dedupedFinish] = removeCommonStringMiddle(start, finish);
  return [dedupedStart, dedupedFinish].join(timespan.finish ? ' to ' : ' ');
}
