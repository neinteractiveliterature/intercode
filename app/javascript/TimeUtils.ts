import { useContext, useMemo, useCallback } from 'react';
import { Moment } from 'moment-timezone';
// eslint-disable-next-line no-restricted-imports
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import TimezonePlugin from 'dayjs/plugin/timezone';
import UtcPlugin from 'dayjs/plugin/utc';

import { onlyOneIsNull } from './ValueUtils';
import AppRootContext from './AppRootContext';
import { Convention } from './graphqlTypes.generated';

dayjs.extend(LocalizedFormat);
dayjs.extend(TimezonePlugin);
dayjs.extend(UtcPlugin);
export { dayjs };

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

export function timezoneNameForConvention(
  convention?: Pick<Convention, 'timezone_mode' | 'timezone_name'> | null,
) {
  if (convention?.timezone_mode === 'convention_local') {
    return convention.timezone_name!;
  }

  return dayjs.tz.guess();
}

export function useISODateTimeInAppZone(isoValue: string) {
  const { timezoneName } = useContext(AppRootContext);
  const timestamp = useMemo(() => dayjs(isoValue).tz(timezoneName), [isoValue, timezoneName]);

  return timestamp;
}

export function getOffsetName(
  language: string,
  timezoneName: string,
  date: dayjs.Dayjs,
  type: 'long' | 'short',
) {
  if (!date.isValid()) {
    return undefined;
  }

  const format = new Intl.DateTimeFormat(language, {
    timeZone: timezoneName,
    timeZoneName: type,
  });
  return format.formatToParts(date.valueOf()).find((part) => part.type === 'timeZoneName')?.value;
}

export function useGetOffsetName() {
  const { language } = useContext(AppRootContext);
  return useCallback(
    (timezoneName: string, date: dayjs.Dayjs, type: 'long' | 'short') =>
      getOffsetName(language, timezoneName, date, type),
    [language],
  );
}
