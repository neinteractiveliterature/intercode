import { DateTime, Duration } from 'luxon';
import Timespan, { FiniteTimespan } from './Timespan';
import { formatLCM, getDateTimeFormat, timezoneNameForConvention } from './TimeUtils';
import { Convention, Event, Run } from './graphqlTypes.generated';
import { TFunction } from 'i18next';
import { DateTimeFormatKey } from './DateTimeFormats';

export type ConventionForTimespanUtils = Pick<Convention, 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>;

export function timespanFromConvention(convention: ConventionForTimespanUtils): Timespan {
  return Timespan.fromStrings(convention.starts_at, convention.ends_at).tz(timezoneNameForConvention(convention));
}

export function timespanFromConventionIfValid(convention: ConventionForTimespanUtils): Timespan | undefined {
  try {
    return timespanFromConvention(convention);
  } catch (err) {
    return undefined;
  }
}

export function timespanFromRun(
  timezoneName: string,
  event: Pick<Event, 'length_seconds'>,
  run: Pick<Run, 'starts_at'>,
): FiniteTimespan {
  const start = DateTime.fromISO(run.starts_at).setZone(timezoneName);
  const finish = start.plus({ seconds: event.length_seconds });

  return Timespan.finiteFromDateTimes(start, finish);
}

export function getConventionDayTimespans(conventionTimespan: FiniteTimespan, timezoneName: string): FiniteTimespan[] {
  return conventionTimespan.getTimespansWithin(timezoneName, {
    unit: 'day',
    offset: Duration.fromObject({ hours: 6 }), // start convention days at 6:00am
  });
}

export function getMemoizationKeyForTimespan(timespan?: Timespan): string {
  if (!timespan) {
    return '';
  }

  return [timespan.start ? timespan.start.toISO() : '', timespan.finish ? timespan.finish.toISO() : ''].join('/');
}

export function describeTimespan(
  timespan: Timespan,
  t: TFunction,
  formatKey: DateTimeFormatKey,
  timeZone: string,
): string {
  const dateTimeFormat = getDateTimeFormat(formatKey, t);
  const formatDateTime = (dateTime: DateTime) => formatLCM(dateTime.setZone(timeZone), dateTimeFormat);

  if (timespan.start && timespan.finish) {
    return t('timespans.finiteBothEnds', {
      start: formatDateTime(timespan.start),
      finish: formatDateTime(timespan.finish),
    });
  } else if (timespan.finish) {
    return t('timespans.infiniteStart', {
      finish: formatDateTime(timespan.finish),
    });
  } else if (timespan.start) {
    return t('timespans.infiniteFinish', {
      start: formatDateTime(timespan.start),
    });
  } else {
    return t('timespans.infiniteBothEnds');
  }
}
