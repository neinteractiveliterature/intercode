import { useContext, useMemo } from 'react';
import { DateTime } from 'luxon';

import { onlyOneIsNull } from './ValueUtils';
import AppRootContext from './AppRootContext';

export const timeIsOnTheHour = (time: DateTime) => (
  time.millisecond === 0 && time.second === 0 && time.minute === 0
);

export const humanTimeFormat = (time: DateTime) => {
  if (timeIsOnTheHour(time)) {
    if (time.hour === 0) {
      return "'midnight'";
    }

    if (time.hour === 12) {
      return "'noon'";
    }
  }

  return 'h:mma';
};

export const lowercaseMeridiem = (timeString: string) => timeString
  .replace(/(?<=:\d\d)([AP]M)$/i, (meridiem) => meridiem.toLowerCase());

export const humanizeTime = (time: DateTime, includeDay?: boolean) => {
  const timeFormatted = lowercaseMeridiem(time.toFormat(humanTimeFormat(time)));
  if (includeDay) {
    return `${time.toFormat('EEE')} ${timeFormatted}`;
  }

  return timeFormatted;
};

export const timesAreSameOrBothNull = (a?: DateTime | null, b?: DateTime | null) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || (a?.valueOf() === b?.valueOf());
};

export const compareTimesAscending = (a: DateTime, b: DateTime) => {
  if (a < b) {
    return -1;
  }

  if (b > a) {
    return 1;
  }

  return 0;
};

export const compareTimesDescending = (a: DateTime, b: DateTime) => compareTimesAscending(b, a);

export function ageAsOf(birthDate: DateTime | null, date: DateTime | null) {
  if (!birthDate || !date || !birthDate.isValid || !date.isValid) {
    return null;
  }

  const onOrAfterBirthday = (
    date.month > birthDate.month || (
      date.month === birthDate.month
      && date.day >= birthDate.day
    )
  );

  return (date.year - birthDate.year - (onOrAfterBirthday ? 0 : 1));
}

export type ConventionForTimezoneName = {
  timezone_mode: string,
  timezone_name?: string | null,
};

export function timezoneNameForConvention(convention?: ConventionForTimezoneName | null): string {
  if (convention?.timezone_mode === 'convention_local' && convention?.timezone_name) {
    return convention.timezone_name;
  }

  return DateTime.local().zoneName;
}

export function useISODateTimeInAppZone(isoValue: string) {
  const { timezoneName } = useContext(AppRootContext);
  const timestamp = useMemo(
    () => DateTime.fromISO(isoValue).setZone(timezoneName),
    [isoValue, timezoneName],
  );

  return timestamp;
}
