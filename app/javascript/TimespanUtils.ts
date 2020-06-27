import { DateTime } from 'luxon';
import Timespan from './Timespan';
import { timezoneNameForConvention } from './TimeUtils';
import { removeCommonStringMiddle } from './ValueUtils';

export interface ConventionForTimespanUtils {
  starts_at?: string | null,
  ends_at?: string | null,
  timezone_name?: string | null,
  timezone_mode: string,
}

export interface RunForTimespanUtils {
  starts_at: string,
}

export interface EventForTimespanUtils {
  length_seconds: number,
}

export function timespanFromConvention(convention: ConventionForTimespanUtils) {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at)
    .setZone(timezoneNameForConvention(convention));
}

export function timespanFromRun(
  timezoneName: string,
  event: EventForTimespanUtils,
  run: RunForTimespanUtils,
) {
  const start = DateTime.fromISO(run.starts_at).setZone(timezoneName);
  const finish = start.plus({ seconds: event.length_seconds });

  return Timespan.fromDateTimes(start, finish);
}

export function getConventionDayTimespans(conventionTimespan: Timespan, timezoneName: string) {
  return conventionTimespan.getTimespansWithin(
    timezoneName,
    {
      unit: 'day',
      offset: { hours: 6 }, // start convention days at 6:00am
    },
  );
}

export function getMemoizationKeyForTimespan(timespan: Timespan | null) {
  if (!timespan) {
    return '';
  }

  return [
    timespan.start ? timespan.start.toISO() : '',
    timespan.finish ? timespan.finish.toISO() : '',
  ].join('/');
}

export function describeInterval(
  timespan: Timespan, formatDateTime: (DateTime) => string, timeZone: string,
) {
  const start = (
    timespan.start
      ? formatDateTime(DateTime.fromISO(timespan.start.toISO()).setZone(timeZone))
      : 'anytime'
  );

  const finish = (
    timespan.finish
      ? formatDateTime(DateTime.fromISO(timespan.finish.toISO()).setZone(timeZone))
      : 'indefinitely'
  );

  const [dedupedStart, dedupedFinish] = removeCommonStringMiddle(start, finish);
  return [dedupedStart, dedupedFinish].join(timespan.finish ? ' to ' : ' ');
}
