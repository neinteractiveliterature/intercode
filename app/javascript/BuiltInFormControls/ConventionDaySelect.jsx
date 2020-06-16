import React, { useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';

function ConventionDaySelect({ convention, value, onChange }) {
  const { timezoneName } = useContext(AppRootContext);
  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention),
    [convention],
  );
  const conventionDays = useMemo(
    () => getConventionDayTimespans(conventionTimespan, timezoneName)
      .map((timespan) => timespan.start),
    [conventionTimespan, timezoneName],
  );

  const inputChange = useCallback(
    (event) => {
      const newDayString = event.target.value;
      onChange(newDayString);
    },
    [onChange],
  );

  const valueDateTime = useMemo(
    () => (value ? DateTime.fromISO(value).setZone(timezoneName) : null),
    [value, timezoneName],
  );

  const options = conventionDays.map((day) => (
    <div className="form-check form-check-inline" key={day.toISO()}>
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          name="day"
          value={day.toISO()}
          checked={+day === +valueDateTime}
          onChange={inputChange}
          aria-label={day.toFormat('EEEE')}
        />
        {' '}
        {day.toFormat('EEEE')}
      </label>
    </div>
  ));

  return (
    <fieldset className="form-group">
      <legend className="col-form-label">Day</legend>
      {options}
    </fieldset>
  );
}

ConventionDaySelect.propTypes = {
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ConventionDaySelect.defaultProps = {
  value: null,
};

export default ConventionDaySelect;
