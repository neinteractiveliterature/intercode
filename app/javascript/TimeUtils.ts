import { useContext, useMemo } from 'react';
import { DateTime, DateTimeFormatOptions } from 'luxon';

import { onlyOneIsNull } from './ValueUtils';
import AppRootContext from './AppRootContext';
import { Convention } from './graphqlTypes.generated';

export const timeIsOnTheHour = (time: DateTime) =>
  time.millisecond === 0 && time.second === 0 && time.minute === 0;

export const humanTimeFormat = (time: DateTime) => {
  if (timeIsOnTheHour(time)) {
    if (time.hour === 0) {
      return "'midnight'";
    }

    if (time.hour === 12) {
      return "'noon'";
    }
  }

  return 'h:mmaaa';
};

// this is just DateTime.toFormat patched with a hack for lowercasing the meridiem
export function formatLCM(dateTime: DateTime, format: string, options?: DateTimeFormatOptions) {
  const hackedFormat = format.replace(/a+/g, (substring) => {
    if (substring === 'aaa') {
      return `'${dateTime.toFormat('a', options).toLowerCase()}'`;
    }

    return substring;
  });

  return dateTime.toFormat(hackedFormat, options);
}

export const humanizeTime = (time: DateTime, includeDay?: boolean) => {
  let timeFormat = humanTimeFormat(time);
  if (includeDay) {
    timeFormat = `ddd ${timeFormat}`;
  }

  return formatLCM(time, timeFormat);
};

export const timesAreSameOrBothNull = (a?: DateTime | null, b?: DateTime | null) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || a?.valueOf() === b?.valueOf();
};

export const compareTimesAscending = (a: DateTime, b: DateTime) => {
  if (a < b) {
    return -1;
  }

  if (b < a) {
    return 1;
  }

  return 0;
};

export const compareTimesDescending = (a: DateTime, b: DateTime) => compareTimesAscending(b, a);

export function ageAsOf(birthDate?: DateTime | null, date?: DateTime | null) {
  if (!birthDate || !date || !birthDate.isValid || !date.isValid) {
    return null;
  }

  const onOrAfterBirthday =
    date.month > birthDate.month || (date.month === birthDate.month && date.day >= birthDate.day);

  return date.year - birthDate.year - (onOrAfterBirthday ? 0 : 1);
}

export function timezoneNameForConvention(
  convention?: Pick<Convention, 'timezone_mode' | 'timezone_name'> | null,
) {
  if (convention?.timezone_mode === 'convention_local') {
    return convention.timezone_name!;
  }

  return DateTime.local().zoneName;
}

export function useISODateTimeInAppZone(isoValue: string) {
  const { timezoneName } = useContext(AppRootContext);
  const timestamp = useMemo(() => DateTime.fromISO(isoValue).setZone(timezoneName), [
    isoValue,
    timezoneName,
  ]);

  return timestamp;
}
