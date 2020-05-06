import { onlyOneIsNull } from './ValueUtils';

export const timeIsOnTheHour = (time) => (
  time.millisecond() === 0 && time.second() === 0 && time.minute() === 0
);

export const humanTimeFormat = (time) => {
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

export const humanizeTime = (time, includeDay) => {
  let timeFormat = humanTimeFormat(time);
  if (includeDay) {
    timeFormat = `ddd ${timeFormat}`;
  }

  return time.format(timeFormat);
};

export const timesAreSameOrBothNull = (a, b) => {
  if (onlyOneIsNull(a, b)) {
    return false;
  }

  return (a == null && b == null) || a.isSame(b);
};

export const compareTimesAscending = (a, b) => {
  if (a.isBefore(b)) {
    return -1;
  }

  if (b.isBefore(a)) {
    return 1;
  }

  return 0;
};

export const compareTimesDescending = (a, b) => compareTimesAscending(b, a);

export function ageAsOf(birthDate, date) {
  if (!birthDate || !date || !birthDate.isValid() || !date.isValid()) {
    return null;
  }

  const onOrAfterBirthday = (
    date.month() > birthDate.month() || (
      date.month() === birthDate.month()
      && date.date() >= birthDate.date()
    )
  );

  return (date.year() - birthDate.year() - (onOrAfterBirthday ? 0 : 1));
}

export function timezoneNameForConvention(convention) {
  return convention?.timezone_name;
}
