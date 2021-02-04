import { DateTime } from 'luxon';
import { useCallback, useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { DateTimeFormatKey } from '../DateTimeFormats';
import Timespan, { FiniteTimespan } from '../Timespan';
import { useAppDateTimeFormat } from '../TimeUtils';

export function conventionRequiresDates(conventionTimespan: Timespan | undefined) {
  const lengthInDays = conventionTimespan?.getLength('days')?.days;
  if (lengthInDays == null || lengthInDays >= 7) {
    return true;
  }

  return false;
}

export type RunTimeFormatOptions = {
  formatType: 'short' | 'long';
  includeDate?: boolean;
  includeZone?: boolean;
};

export function getRunTimeFormat(
  conventionTimespan: Timespan | undefined,
  options: RunTimeFormatOptions,
): DateTimeFormatKey {
  const { formatType } = options;
  const includeDate = options.includeDate ?? true;
  const includeZone = options.includeZone ?? true;

  if (!includeDate) {
    return includeZone ? 'shortTimeWithZone' : 'shortTime';
  }

  // Only show weekday-based times for conventions less than a week long
  if (conventionRequiresDates(conventionTimespan)) {
    if (formatType === 'short') {
      return includeZone ? 'shortDateTimeWithZone' : 'shortDateTime';
    }

    return includeZone ? 'longDateTimeWithZone' : 'longDateTime';
  }

  if (formatType === 'short') {
    return includeZone ? 'shortWeekdayTimeWithZone' : 'shortWeekdayTime';
  }

  return includeZone ? 'longWeekdayTimeWithZone' : 'longWeekdayTime';
}

export function useFormatRunTime() {
  const { conventionTimespan } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  const formatRunTime = useCallback(
    (time: DateTime, options: RunTimeFormatOptions) =>
      format(time, getRunTimeFormat(conventionTimespan, options)),
    [conventionTimespan, format],
  );

  return formatRunTime;
}

export function useFormatRunTimespan() {
  const formatRunTime = useFormatRunTime();
  const { timezoneName } = useContext(AppRootContext);
  const formatRunTimespan = useCallback(
    (timespan: FiniteTimespan, options: RunTimeFormatOptions) => {
      const { start, finish } = timespan.tz(timezoneName);
      if (start.day === finish.day) {
        return `${formatRunTime(start, {
          ...options,
          includeZone: false,
        })} - ${formatRunTime(finish, {
          ...options,
          includeDate: false,
        })}`;
      }

      return `${formatRunTime(start, {
        ...options,
        includeDate: true,
        includeZone: false,
      })} - ${formatRunTime(finish, {
        ...options,
        includeDate: true,
      })}`;
    },
    [formatRunTime, timezoneName],
  );

  return formatRunTimespan;
}
