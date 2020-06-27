import React, { useCallback, useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import { timespanFromConvention, getConventionDayTimespans } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';

import type { ConventionForTimespanUtils } from '../TimespanUtils';

export type ConventionDaySelectProps = {
  convention: ConventionForTimespanUtils,
  value?: string | null,
  onChange: (string) => void,
};

function ConventionDaySelect({ convention, value, onChange }: ConventionDaySelectProps) {
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
          checked={valueDateTime != null && +day === +valueDateTime}
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

export default ConventionDaySelect;
