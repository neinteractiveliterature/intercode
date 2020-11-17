import moment from 'moment-timezone';

import Timespan, { FiniteTimespan } from './Timespan';
import { timezoneNameForConvention } from './TimeUtils';
import { removeCommonStringMiddle } from './ValueUtils';
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
  const start = moment(run.starts_at).tz(timezoneName);
  const finish = start.clone().add(event.length_seconds, 'seconds');

  return Timespan.fromMoments(start, finish) as FiniteTimespan;
}

export function getConventionDayTimespans(
  conventionTimespan: FiniteTimespan,
  timezoneName: string,
) {
  return conventionTimespan.getTimespansWithin(timezoneName, {
    unit: 'day',
    offset: moment.duration(6, 'hours'), // start convention days at 6:00am
  });
}

export function getMemoizationKeyForTimespan(timespan?: Timespan) {
  if (!timespan) {
    return '';
  }

  return [
    timespan.start ? timespan.start.toISOString() : '',
    timespan.finish ? timespan.finish.toISOString() : '',
  ].join('/');
}

export function describeInterval(timespan: Timespan, formatDate: (date: Date) => string) {
  const start = timespan.start ? formatDate(new Date(timespan.start.toISOString())) : 'anytime';

  const finish = timespan.finish
    ? formatDate(new Date(timespan.finish.toISOString()))
    : 'indefinitely';

  const [dedupedStart, dedupedFinish] = removeCommonStringMiddle(start, finish);
  return [dedupedStart, dedupedFinish].join(timespan.finish ? ' to ' : ' ');
}
