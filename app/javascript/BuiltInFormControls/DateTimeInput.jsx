import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

function parseDateTimeValues(valueString, timezoneName) {
  const parsedValue = moment.tz(valueString, timezoneName);

  if (!parsedValue.isValid()) {
    return {
      date: null,
      time: null,
    };
  }

  return {
    date: parsedValue.format('YYYY-MM-DD'),
    time: parsedValue.format('HH:mm:ss'),
  };
}

function DateTimeInput({
  value, timezoneName, onChange, id,
}) {
  const { date, time } = useMemo(
    () => parseDateTimeValues(value, timezoneName),
    [timezoneName, value],
  );

  const dateTimeValuesChanged = (newDate, newTime) => {
    const momentValue = moment.tz(
      `${newDate}, ${newTime}`,
      'YYYY-MM-DD HH:mm:ss',
      timezoneName,
    );

    onChange(momentValue.toISOString());
  };

  const dateChanged = (event) => dateTimeValuesChanged(event.target.value, time);
  const timeChanged = (event) => dateTimeValuesChanged(date, event.target.value);

  return (
    <div className="d-flex">
      <input
        type="date"
        className="form-control mr-1"
        value={date || ''}
        onChange={dateChanged}
        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        id={id}
        aria-label="Date"
      />
      <input
        type="time"
        className="form-control"
        value={time || ''}
        onChange={timeChanged}
        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
        aria-label="Time"
      />
    </div>
  );
}

DateTimeInput.propTypes = {
  value: PropTypes.string,
  timezoneName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
};

DateTimeInput.defaultProps = {
  value: null,
  id: null,
};

export default DateTimeInput;
