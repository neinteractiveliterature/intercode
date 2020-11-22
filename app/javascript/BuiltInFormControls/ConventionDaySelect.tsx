import { useCallback, useMemo } from 'react';
import * as React from 'react';
import { parseISO, isEqual } from 'date-fns';

import { useAppDateFormat } from '../TimeUtils';
import {
  timespanFromConvention,
  getConventionDayTimespans,
  ConventionForTimespanUtils,
} from '../TimespanUtils';

export type ConventionDaySelectProps = {
  convention: ConventionForTimespanUtils;
  value?: Date;
  onChange: React.Dispatch<Date>;
};

function ConventionDaySelect({ convention, value, onChange }: ConventionDaySelectProps) {
  const appDateFormat = useAppDateFormat();
  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);
  const conventionDays = useMemo(
    () =>
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(conventionTimespan).map((timespan) => timespan.start)
        : [],
    [conventionTimespan],
  );

  const inputChange = useCallback(
    (event) => {
      const newDayString = event.target.value;
      onChange(parseISO(newDayString));
    },
    [onChange],
  );

  const options = conventionDays.map((day) => (
    <div className="form-check form-check-inline" key={day.toISOString()}>
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          name="day"
          value={day.toISOString()}
          checked={value && isEqual(day, value)}
          onChange={inputChange}
          aria-label={appDateFormat(day, 'eeee')}
        />{' '}
        {appDateFormat(day, 'eeee')}
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
