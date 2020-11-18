import { useContext, useCallback } from 'react';
import { format, utcToZonedTime, OptionsWithTZ } from 'date-fns-tz';
import {
  getMilliseconds,
  getSeconds,
  getMinutes,
  getHours,
  getDate,
  getMonth,
  getYear,
  isEqual,
  isBefore,
  isValid,
} from 'date-fns';

import { onlyOneIsNull } from './ValueUtils';
import AppRootContext from './AppRootContext';
import { Convention } from './graphqlTypes.generated';

// pull this out when https://github.com/date-fns/date-fns/pull/2016 is merged
export const formatWithLowercaseMeridiemHack = (
  date: string | number | Date,
  formatStr: string,
  options?: OptionsWithTZ,
) => {
  const hackedFormat = formatStr.replace(/a+/g, (substring) => {
    if (substring === 'aaa') {
      return `'${format(date, 'a', options).toLowerCase()}'`;
    }

    return substring;
  });

  return format(date, hackedFormat, options);
};

export const timeIsOnTheHour = (time: Date) =>
  getMilliseconds(time) === 0 && getSeconds(time) === 0 && getMinutes(time) === 0;

export const humanTimeFormat = (time: Date) => {
  if (timeIsOnTheHour(time)) {
    if (getHours(time) === 0) {
      return "'midnight'";
    }

    if (getHours(time) === 12) {
      return "'noon'";
    }
  }

  return 'h:mmaaa';
};

export const humanizeTime = (time: Date, includeDay?: boolean, options?: OptionsWithTZ) => {
  let timeFormat = humanTimeFormat(time);
  if (includeDay) {
    timeFormat = `E ${timeFormat}`;
  }

  return formatWithLowercaseMeridiemHack(time, timeFormat, options);
};

export const timesAreSameOrBothNull = (a?: Date | null, b?: Date | null) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || isEqual(a!, b!);
};

export const compareTimesAscending = (a: Date, b: Date) => {
  if (isBefore(a, b)) {
    return -1;
  }

  if (isBefore(b, a)) {
    return 1;
  }

  return 0;
};

export const compareTimesDescending = (a: Date, b: Date) => compareTimesAscending(b, a);

export function ageAsOf(birthDate?: Date | null, date?: Date | null) {
  if (!birthDate || !date || !isValid(birthDate) || !isValid(date)) {
    return null;
  }

  const onOrAfterBirthday =
    getMonth(date) > getMonth(birthDate) ||
    (getMonth(date) === getMonth(birthDate) && getDate(date) >= getDate(birthDate));

  return getYear(date) - getYear(birthDate) - (onOrAfterBirthday ? 0 : 1);
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
