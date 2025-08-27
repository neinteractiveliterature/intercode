import { useCallback, useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import { timespanFromConvention, getConventionDayTimespans, ConventionForTimespanUtils } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';
import { useAppDateTimeFormat } from '../TimeUtils';
import { conventionRequiresDates } from '../EventsApp/runTimeFormatting';
import { DateInput } from './DateTimeInput';

export type ConventionDaySelectProps = {
  convention: ConventionForTimespanUtils;
  value?: DateTime;
  onChange: React.Dispatch<DateTime>;
};

function ConventionDaySelect({ convention, value, onChange }: ConventionDaySelectProps): React.JSX.Element {
  const { timezoneName, siteMode } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const conventionTimespan = useMemo(() => timespanFromConvention(convention), [convention]);
  const showDateInput = useMemo(
    () => conventionRequiresDates(conventionTimespan, siteMode),
    [conventionTimespan, siteMode],
  );
  const conventionDays = useMemo(
    () =>
      conventionTimespan.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName).map((timespan) => timespan.start)
        : [],
    [conventionTimespan, timezoneName],
  );

  const inputChange = useCallback(
    (newDayString: string) => {
      onChange(DateTime.fromISO(newDayString, { zone: timezoneName }));
    },
    [onChange, timezoneName],
  );

  if (showDateInput) {
    return (
      <fieldset className="mb-3">
        <legend className="col-form-label">Date</legend>
        <DateInput value={value?.toISODate()} onChange={inputChange} />
      </fieldset>
    );
  }

  const options = conventionDays.map((day) => (
    <div className="form-check form-check-inline" key={day.toISO()}>
      <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          name="day"
          value={day.toISO() ?? ''}
          checked={day.toMillis() === value?.toMillis()}
          onChange={(event) => inputChange(event.target.value)}
          aria-label={format(day, 'longWeekday')}
        />{' '}
        {format(day, 'longWeekday')}
      </label>
    </div>
  ));

  return (
    <fieldset className="mb-3">
      <legend className="col-form-label">Day</legend>
      {options}
    </fieldset>
  );
}

export default ConventionDaySelect;
