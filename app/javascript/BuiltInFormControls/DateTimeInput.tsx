import { useMemo, useContext, useState, useEffect } from 'react';
import * as React from 'react';
import { DateTime } from 'luxon';

import AppRootContext from '../AppRootContext';

function dateTimeToISO(
  date: string | null | undefined,
  time: string | null | undefined,
  timezoneName: string | null | undefined,
) {
  if (date == null || time == null || timezoneName == null) {
    return null;
  }

  const newDateTime = DateTime.fromISO(`${date}T${time}`, { zone: timezoneName });

  if (!newDateTime.isValid) {
    return null;
  }

  const isoDateTime = newDateTime.toISO();
  if (isoDateTime) {
    // work around Luxon issue: https://github.com/moment/luxon/issues/632
    return isoDateTime.replace(/\.\d+$/, '');
  }

  return isoDateTime;
}

export type DateInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'type' | 'className' | 'pattern' | 'aria-label'
> & {
  value?: string | null;
  onChange: React.Dispatch<string>;
};

export function DateInput({ value, onChange, ...otherProps }: DateInputProps): React.JSX.Element {
  const dateChanged = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <input
      type="date"
      className="form-control me-1"
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

export function TimeInput({ value, onChange, ...otherProps }: TimeInputProps): React.JSX.Element {
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

function DateTimeInput({
  value,
  timezoneName,
  onChange,
  id,
  alwaysShowTimezone,
  ...otherProps
}: DateTimeInputProps): React.JSX.Element {
  const { timezoneName: appTimezoneName } = useContext(AppRootContext);
  const effectiveTimezoneName = timezoneName || appTimezoneName;
  const dateTime = useMemo(
    () => DateTime.fromISO(value ?? '').setZone(effectiveTimezoneName),
    [value, effectiveTimezoneName],
  );
  const [date, setDate] = useState(() => dateTime.toISODate());
  const [time, setTime] = useState(() =>
    dateTime.toISOTime({
      suppressMilliseconds: true,
      includeOffset: false,
    }),
  );
  const userTimezoneName = DateTime.local().zoneName;
  const showZone =
    alwaysShowTimezone || effectiveTimezoneName !== appTimezoneName || effectiveTimezoneName !== userTimezoneName;

  useEffect(() => {
    if (dateTime.isValid) {
      setDate(dateTime.toISODate());
      setTime(dateTime.toISOTime({ suppressMilliseconds: true, includeOffset: false }));
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
        <span className="ms-2">
          {dateTime.offsetNameShort ?? DateTime.fromObject({}, { zone: effectiveTimezoneName }).offsetNameShort}
        </span>
      )}
    </div>
  );
}

export default DateTimeInput;
