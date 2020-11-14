import { useMemo, useContext, useState, useEffect } from 'react';
import * as React from 'react';

import AppRootContext from '../AppRootContext';
import { dayjs, useGetOffsetName } from '../TimeUtils';

function dateTimeToISO(
  date: string | null | undefined,
  time: string | null | undefined,
  timezoneName: string | null | undefined,
) {
  if (date == null || time == null || timezoneName == null) {
    return null;
  }

  const newDateTime = dayjs.tz(`${date}T${time}`, timezoneName);

  if (!newDateTime.isValid()) {
    return null;
  }

  const isoDateTime = newDateTime.toISOString();
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

function DateTimeInput({
  value,
  timezoneName,
  onChange,
  id,
  alwaysShowTimezone,
  ...otherProps
}: DateTimeInputProps) {
  const { timezoneName: appTimezoneName } = useContext(AppRootContext);
  const effectiveTimezoneName = timezoneName || appTimezoneName;
  const dateTime = useMemo(() => dayjs(value ?? '').tz(effectiveTimezoneName), [
    value,
    effectiveTimezoneName,
  ]);
  const [date, setDate] = useState(() => dateTime.format('YYYY-MM-DD'));
  const [time, setTime] = useState(() => dateTime.format('HH:mm:ss'));
  const userTimezoneName = dayjs.tz.guess();
  const showZone =
    alwaysShowTimezone ||
    effectiveTimezoneName !== appTimezoneName ||
    effectiveTimezoneName !== userTimezoneName;
  const getOffsetName = useGetOffsetName();

  useEffect(() => {
    if (dateTime.isValid()) {
      setDate(dateTime.format('YYYY-MM-DD'));
      setTime(dateTime.format('HH:mm:ss'));
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
        <span className="ml-2">{getOffsetName(effectiveTimezoneName, dateTime, 'short')}</span>
      )}
    </div>
  );
}

export default DateTimeInput;
