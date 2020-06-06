import React, { useCallback, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import moment from 'moment-timezone';
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
      onChange(moment(newDayString).tz(timezoneName));
    },
    [onChange, timezoneName],
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
  }).isRequired,
  value: MomentPropTypes.momentObj,
  onChange: PropTypes.func.isRequired,
};

ConventionDaySelect.defaultProps = {
  value: null,
};

export default ConventionDaySelect;
