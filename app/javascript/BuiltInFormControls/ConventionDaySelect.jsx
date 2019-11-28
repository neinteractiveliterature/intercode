import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import moment from 'moment-timezone';
import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';

function ConventionDaySelect({ convention, value, onChange }) {
  const conventionTimespan = useMemo(
    () => timespanFromConvention(convention),
    [convention],
  );
  const conventionDays = useMemo(
    () => getConventionDayTimespans(conventionTimespan, convention.timezone_name)
      .map((timespan) => timespan.start),
    [convention, conventionTimespan],
  );

  const inputChange = useCallback(
    (event) => {
      const newDayString = event.target.value;
      onChange(moment(newDayString).tz(convention.timezone_name));
    },
    [convention, onChange],
  );

  const options = conventionDays.map((day) => (
    <div className="form-check form-check-inline" key={day.toISOString()}>
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          name="day"
          value={day.toISOString()}
          checked={day.isSame(value)}
          onChange={inputChange}
          aria-label={day.format('dddd')}
        />
        {' '}
        {day.format('dddd')}
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
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  value: MomentPropTypes.momentObj,
  onChange: PropTypes.func.isRequired,
};

ConventionDaySelect.defaultProps = {
  value: null,
};

export default ConventionDaySelect;
