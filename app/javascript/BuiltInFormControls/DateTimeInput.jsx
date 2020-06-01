import React, {
  useMemo, useContext, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import AppRootContext from '../AppRootContext';

function dateTimeToISO(date, time, timezoneName) {
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

export function DateInput({
  value, onChange, ...otherProps
}) {
  const dateChanged = (event) => onChange(event.target.value);

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

DateInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

DateInput.defaultProps = {
  value: null,
};

export function TimeInput({
  value, onChange, ...otherProps
}) {
  const timeChanged = (event) => onChange(event.target.value);

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

TimeInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TimeInput.defaultProps = {
  value: null,
};

function DateTimeInput({
  value, timezoneName, onChange, id, alwaysShowTimezone, ...otherProps
}) {
  const dateTime = useMemo(
    () => DateTime.fromISO(value).setZone(timezoneName),
    [value, timezoneName],
  );
  const [date, setDate] = useState(() => dateTime.toISODate());
  const [time, setTime] = useState(() => dateTime.toISOTime({
    suppressMilliseconds: true, includeOffset: false,
  }));
  const { timezoneName: appTimezoneName } = useContext(AppRootContext);
  const showZone = alwaysShowTimezone || (
    dateTime?.zoneName && dateTime.zoneName !== appTimezoneName
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

  const dateChanged = (newDate) => {
    setDate(newDate);
    const newValue = dateTimeToISO(newDate, time, timezoneName);
    if (newValue) {
      onChange(newValue);
    }
  };

  const timeChanged = (newTime) => {
    setTime(newTime);
    const newValue = dateTimeToISO(date, newTime, timezoneName);
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
          {dateTime.offsetNameShort ?? DateTime.fromObject({ zone: timezoneName }).offsetNameShort}
        </span>
      )}
    </div>
  );
}

DateTimeInput.propTypes = {
  value: PropTypes.string,
  timezoneName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  alwaysShowTimezone: PropTypes.bool,
};

DateTimeInput.defaultProps = {
  value: null,
  id: null,
  alwaysShowTimezone: false,
};

export default DateTimeInput;
