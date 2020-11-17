import { useMemo, useContext, useState, useEffect } from 'react';
import * as React from 'react';
import { formatISO, Locale } from 'date-fns';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import { getUserTimezoneName } from '../TimeUtils';

import AppRootContext from '../AppRootContext';

function dateTimeToISO(
  date: string | null | undefined,
  time: string | null | undefined,
  timezoneName: string | null | undefined,
) {
  if (date == null || time == null || timezoneName == null) {
    return null;
  }

  const newDateTime = toDate(`${date}T${time}`, { timeZone: timezoneName });

  if (Number.isNaN(newDateTime.valueOf())) {
    return null;
  }

  const isoDateTime = formatISO(newDateTime);
  // if (isoDateTime) {
  //   // work around Luxon issue: https://github.com/moment/luxon/issues/632
  //   return isoDateTime.replace(/\.\d+$/, '');
  // }

  return isoDateTime;
}

export type DateInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'className' | 'pattern' | 'aria-label'
> & {
  value?: string | null;
  onChange: React.Dispatch<string>;
};

export function DateInput({ value, onChange, ...otherProps }: DateInputProps) {
  const dateChanged = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <input
      type="date"
      className="form-control mr-1"
      value={value ?? ''}
      onChange={dateChanged}
      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
      aria-label="Date"
      {...otherProps}
    />
  );
}

export type TimeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'className' | 'pattern' | 'aria-label'
> & {
  value?: string | null;
  onChange: React.Dispatch<string>;
};

export function TimeInput({ value, onChange, ...otherProps }: TimeInputProps) {
  const timeChanged = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <input
      type="time"
      className="form-control"
      value={value || ''}
      onChange={timeChanged}
      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
      aria-label="Time"
      {...otherProps}
    />
  );
}

export type DateTimeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'className' | 'pattern' | 'aria-label'
> & {
  value?: string | null;
  onChange: React.Dispatch<string>;
  timezoneName?: string;
  alwaysShowTimezone?: boolean;
};

function formatDate(dateTime: Date) {
  if (Number.isNaN(dateTime.valueOf())) {
    return '';
  }

  return formatISO(dateTime, { representation: 'date' });
}

function formatTime(dateTime: Date) {
  if (Number.isNaN(dateTime.valueOf())) {
    return '';
  }

  return format(dateTime, 'HH:mm:ss');
}

function formatShortZoneName(dateTime: Date, timezoneName: string, locale?: Locale) {
  if (Number.isNaN(dateTime.valueOf())) {
    return format(utcToZonedTime(new Date(), timezoneName), 'zzz', {
      locale,
      timeZone: timezoneName,
    });
  }

  return format(dateTime, 'zzz', { locale, timeZone: timezoneName });
}

function DateTimeInput({
  value,
  timezoneName,
  onChange,
  id,
  alwaysShowTimezone,
  ...otherProps
}: DateTimeInputProps) {
  const { timezoneName: appTimezoneName, dateFnsLocale } = useContext(AppRootContext);
  const effectiveTimezoneName = timezoneName || appTimezoneName;
  const dateTime = useMemo(
    () => (value ? utcToZonedTime(new Date(value), effectiveTimezoneName) : new Date(NaN)),
    [value, effectiveTimezoneName],
  );
  const [date, setDate] = useState(() => formatDate(dateTime));
  const [time, setTime] = useState(() => formatTime(dateTime));
  const showZone =
    alwaysShowTimezone ||
    effectiveTimezoneName !== appTimezoneName ||
    effectiveTimezoneName !== getUserTimezoneName();

  useEffect(() => {
    if (!Number.isNaN(dateTime.valueOf())) {
      setDate(formatDate(dateTime));
      setTime(formatTime(dateTime));
    }
  }, [dateTime]);

  const dateChanged = (newDate: string) => {
    setDate(newDate);
    const newValue = dateTimeToISO(newDate, time, effectiveTimezoneName);
    if (newValue) {
      onChange(newValue);
    }
  };

  const timeChanged = (newTime: string) => {
    setTime(newTime);
    const newValue = dateTimeToISO(date, newTime, effectiveTimezoneName);
    if (newValue) {
      onChange(newValue);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <DateInput value={date} onChange={dateChanged} id={id} {...otherProps} />
      <TimeInput value={time} onChange={timeChanged} {...otherProps} />
      {showZone && (
        <span className="ml-2">
          {formatShortZoneName(dateTime, effectiveTimezoneName, dateFnsLocale)}
        </span>
      )}
    </div>
  );
}

export default DateTimeInput;
