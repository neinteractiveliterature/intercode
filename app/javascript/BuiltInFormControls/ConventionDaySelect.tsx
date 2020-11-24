import { useCallback, useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import {
  timespanFromConvention,
  getConventionDayTimespans,
  ConventionForTimespanUtils,
} from '../TimespanUtils';
import AppRootContext from '../AppRootContext';

export type ConventionDaySelectProps = {
  convention: ConventionForTimespanUtils;
  value?: DateTime;
  onChange: React.Dispatch<DateTime>;
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
      onChange(DateTime.fromISO(newDayString, { zone: timezoneName }));
    },
    [onChange, timezoneName],
  );

  const options = conventionDays.map((day) => (
    <div className="form-check form-check-inline" key={day.toISO()}>
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          name="day"
          value={day.toISO()}
          checked={day.toMillis() === value?.toMillis()}
          onChange={inputChange}
          aria-label={day.toFormat('cccc')}
        />{' '}
        {day.toFormat('cccc')}
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
