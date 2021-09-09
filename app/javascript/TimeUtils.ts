import { useCallback, useContext, useMemo } from 'react';
import { DateTime, LocaleOptions } from 'luxon';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { onlyOneIsNull } from '@neinteractiveliterature/litform';

import AppRootContext from './AppRootContext';
import { Convention } from './graphqlTypes.generated';
import { DateTimeFormatKey } from './DateTimeFormats';

export function getDateTimeFormat(key: DateTimeFormatKey, t: TFunction) {
  return t(`dateTimeFormats.${key}`);
}

export const timeIsOnTheHour = (time: DateTime) =>
  time.millisecond === 0 && time.second === 0 && time.minute === 0;

export const humanTimeFormat = (time: DateTime, t: TFunction, includeDay?: boolean) => {
  if (timeIsOnTheHour(time)) {
    if (time.hour === 0) {
      return getDateTimeFormat(includeDay ? 'weekdayMidnight' : 'midnight', t);
    }

    if (time.hour === 12) {
      return getDateTimeFormat(includeDay ? 'weekdayMidnight' : 'noon', t);
    }
  }

  return getDateTimeFormat(includeDay ? 'shortWeekdayTime' : 'shortTime', t);
};

// this is just DateTime.toFormat patched with a hack for lowercasing the meridiem
export function formatLCM(dateTime: DateTime, format: string, options?: LocaleOptions) {
  const hackedFormat = format.replace(/a+/g, (substring) => {
    if (substring === 'aaa') {
      return `'${dateTime.toFormat('a', options).toLowerCase()}'`;
    }

    return substring;
  });

  return dateTime.toFormat(hackedFormat, options);
}

export function useAppDateTimeFormat() {
  const { t } = useTranslation();
  const format = useCallback(
    (dateTime: DateTime, formatKey: DateTimeFormatKey, options?: LocaleOptions) =>
      formatLCM(dateTime, getDateTimeFormat(formatKey, t), options),
    [t],
  );
  return format;
}

export const humanizeTime = (time: DateTime, t: TFunction, includeDay?: boolean) =>
  formatLCM(time, humanTimeFormat(time, t, includeDay));

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
  const timestamp = useMemo(
    () => DateTime.fromISO(isoValue).setZone(timezoneName),
    [isoValue, timezoneName],
  );

  return timestamp;
}
