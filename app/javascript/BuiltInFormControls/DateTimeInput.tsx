import React, {
  useMemo, useContext, useState, useEffect, SetStateAction,
} from 'react';
import { DateTime } from 'luxon';

import AppRootContext from '../AppRootContext';

function dateTimeToISO(date: string, time: string, timezoneName: string) {
  if (date == null || time == null || timezoneName == null) {
    return null;
  }

  const newDateTime = DateTime.fromISO(
    `${date}T${time}`,
    { zone: timezoneName },
  );

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

export type DateInputProps = (
  Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange'
  > &
  {
    value?: string | null,
    onChange: (newValue: string) => void,
  }
);

export function DateInput({
  value, onChange, ...otherProps
}: DateInputProps) {
  const dateChanged = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <input
      type="date"
      className="form-control mr-1"
      value={value || ''}
      onChange={dateChanged}
      pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
      aria-label="Date"
      {...otherProps}
    />
  );
}

export type TimeInputProps = (
  Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange'
  > &
  {
    value?: string | null,
    onChange: (newValue: string) => void,
  }
);

export function TimeInput({
  value, onChange, ...otherProps
}: TimeInputProps) {
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

export type DateTimeInputProps = (
  Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange' | 'id' | 'timezoneName' | 'alwaysShowTimezone'
  > &
  {
    value?: string | null,
    timezoneName?: string,
    onChange: React.Dispatch<SetStateAction<string | null | undefined>>,
    id?: string,
    alwaysShowTimezone?: boolean,
  }
);

function DateTimeInput({
  value, timezoneName, onChange, id, alwaysShowTimezone, ...otherProps
}: DateTimeInputProps) {
  const { timezoneName: appTimezoneName } = useContext(AppRootContext);
  const effectiveTimezoneName = timezoneName || appTimezoneName;
  const dateTime = useMemo(
    () => (value
      ? DateTime.fromISO(value).setZone(effectiveTimezoneName)
      : DateTime.invalid('value is null or undefined')),
    [value, effectiveTimezoneName],
  );
  const [date, setDate] = useState(() => dateTime.toISODate());
  const [time, setTime] = useState(() => dateTime.toISOTime({
    suppressMilliseconds: true, includeOffset: false,
  }));
  const userTimezoneName = DateTime.local().zoneName;
  const showZone = alwaysShowTimezone || (
    effectiveTimezoneName !== appTimezoneName
    || effectiveTimezoneName !== userTimezoneName
  );

  useEffect(
    () => {
      if (dateTime.isValid) {
        setDate(dateTime.toISODate());
        setTime(dateTime.toISOTime({ suppressMilliseconds: true, includeOffset: false }));
      }
    },
    [dateTime],
  );

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
      <DateInput
        value={date}
        onChange={dateChanged}
        id={id}
        {...otherProps}
      />
      <TimeInput
        value={time}
        onChange={timeChanged}
        {...otherProps}
      />
      {showZone && (
        <span className="ml-2">
          {dateTime.offsetNameShort ?? DateTime
            .fromObject({ zone: effectiveTimezoneName }).offsetNameShort}
        </span>
      )}
    </div>
  );
}

export default DateTimeInput;
