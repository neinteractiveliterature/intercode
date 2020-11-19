import { parseISO, add } from 'date-fns';
import Timespan, { FiniteTimespan } from './Timespan';
import { timezoneNameForConvention } from './TimeUtils';
import { removeCommonStringMiddle } from './ValueUtils';
import { Convention, Event, Run } from './graphqlTypes.generated';

export type ConventionForTimespanUtils = Pick<
  Convention,
  'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'
>;

export function timespanFromConvention(convention: ConventionForTimespanUtils) {
  return Timespan.fromStrings(
    convention.starts_at,
    convention.ends_at,
    timezoneNameForConvention(convention),
  );
}

export function timespanFromRun(
  timezoneName: string,
  event: Pick<Event, 'length_seconds'>,
  run: Pick<Run, 'starts_at'>,
) {
  const start = parseISO(run.starts_at);
  const finish = add(start, { seconds: event.length_seconds });

  return Timespan.fromDates(start, finish, timezoneName) as FiniteTimespan;
}

export function getConventionDayTimespans(conventionTimespan: FiniteTimespan) {
  return conventionTimespan.getTimespansWithin({
    unit: 'days',
    offset: { hours: 6 }, // start convention days at 6:00am
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
