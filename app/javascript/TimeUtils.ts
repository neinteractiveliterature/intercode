import { useContext, useCallback } from 'react';
import { format, utcToZonedTime, OptionsWithTZ } from 'date-fns-tz';
import { Moment } from 'moment-timezone';

import { onlyOneIsNull } from './ValueUtils';
import AppRootContext from './AppRootContext';
import { Convention } from './graphqlTypes.generated';

export const timeIsOnTheHour = (time: Moment) =>
  time.millisecond() === 0 && time.second() === 0 && time.minute() === 0;

export const humanTimeFormat = (time: Moment) => {
  if (timeIsOnTheHour(time)) {
    if (time.hour() === 0) {
      return '[midnight]';
    }

    if (time.hour() === 12) {
      return '[noon]';
    }
  }

  return 'h:mma';
};

export const humanizeTime = (time: Moment, includeDay?: boolean) => {
  let timeFormat = humanTimeFormat(time);
  if (includeDay) {
    timeFormat = `ddd ${timeFormat}`;
  }

  return time.format(timeFormat);
};

export const timesAreSameOrBothNull = (a?: Moment | null, b?: Moment | null) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || a!.isSame(b ?? undefined);
};

export const compareTimesAscending = (a: Moment, b: Moment) => {
  if (a.isBefore(b)) {
    return -1;
  }

  if (b.isBefore(a)) {
    return 1;
  }

  return 0;
};

export const compareTimesDescending = (a: Moment, b: Moment) => compareTimesAscending(b, a);

export function ageAsOf(birthDate?: Moment | null, date?: Moment | null) {
  if (!birthDate || !date || !birthDate.isValid() || !date.isValid()) {
    return null;
  }

  const onOrAfterBirthday =
    date.month() > birthDate.month() ||
    (date.month() === birthDate.month() && date.date() >= birthDate.date());

  return date.year() - birthDate.year() - (onOrAfterBirthday ? 0 : 1);
}

let userTimezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function getUserTimezoneName() {
  return userTimezoneName;
}

export function setUserTimezoneName(value: string) {
  userTimezoneName = value;
}

export function timezoneNameForConvention(
  convention?: Pick<Convention, 'timezone_mode' | 'timezone_name'> | null,
) {
  if (convention?.timezone_mode === 'convention_local') {
    return convention.timezone_name!;
  }

  return userTimezoneName;
}

export function formatInTimezone(
  date: string | number | Date,
  formatStr: string,
  timeZone: string,
  options?: Omit<OptionsWithTZ, 'timeZone'>,
) {
  return format(utcToZonedTime(date, timeZone), formatStr, { ...options, timeZone });
}

export function useAppDateFormat() {
  const { timezoneName, dateFnsLocale } = useContext(AppRootContext);
  const appDateFormat = useCallback(
    (
      date: string | number | Date,
      formatStr: string,
      options?: Omit<OptionsWithTZ, 'timeZone' | 'locale'>,
    ) => {
      return formatInTimezone(date, formatStr, timezoneName, { ...options, locale: dateFnsLocale });
    },
    [timezoneName, dateFnsLocale],
  );
  return appDateFormat;
}
