import { useCallback, useMemo, useContext } from 'react';
import * as React from 'react';
import moment, { Moment } from 'moment-timezone';
import {
  timespanFromConvention,
  getConventionDayTimespans,
  ConventionForTimespanUtils,
} from '../TimespanUtils';
import AppRootContext from '../AppRootContext';

export type ConventionDaySelectProps = {
  convention: ConventionForTimespanUtils;
  value?: Moment;
  onChange: React.Dispatch<Moment>;
};

function ConventionDaySelect({ convention, value, onChange }: ConventionDaySelectProps) {
  const { timezoneName } = useContext(AppRootContext);
  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);
  const conventionDays = useMemo(
    () =>
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName).map(
            (timespan) => timespan.start,
          )
        : [],
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
        />{' '}
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

export default ConventionDaySelect;
