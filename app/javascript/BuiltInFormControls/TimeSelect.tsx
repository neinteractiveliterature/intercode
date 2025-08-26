import { ReactNode, useMemo, useId } from 'react';
import * as React from 'react';

import { getMemoizationKeyForTimespan } from '../TimespanUtils';
import { FiniteTimespan } from '../Timespan';
import { useAppDateTimeFormat } from '../TimeUtils';

export type TimeValues = {
  hour?: number;
  minute?: number;
};

export type TimeSelectProps = {
  value: TimeValues;
  onChange: React.Dispatch<TimeValues>;
  timespan: FiniteTimespan;
  children?: ReactNode;
};

function TimeSelect({ value, timespan, onChange, children }: TimeSelectProps): React.JSX.Element {
  const format = useAppDateTimeFormat();
  const hourValues = useMemo(
    () => {
      let hourOffset = 0;
      const options = [];
      while (timespan.start.plus({ hours: hourOffset }) < timespan.finish) {
        const now = timespan.start.plus({ hours: hourOffset });
        const dayDiff = Math.floor(now.diff(timespan.start.startOf('day'), 'days').days);
        let description = `${format(now, 'shortHour')}`;
        if (dayDiff > 0) {
          description += ` (+${dayDiff} ${dayDiff > 1 ? 'days' : 'day'})`;
        }

        options.push({
          hourOffset,
          description,
          optionValue: hourOffset + timespan.start.hour,
        });
        hourOffset += 1;
      }

      return options;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getMemoizationKeyForTimespan(timespan)],
  );

  const inputChanged = (event: React.FocusEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;

    if (newValue && newValue !== '') {
      const newTime = { ...value, [event.target.name]: parseInt(newValue, 10) };
      if (event.target.name === 'hour' && newTime.minute == null) {
        newTime.minute = 0;
      }
      onChange(newTime);
    } else {
      onChange({ ...value, [event.target.name]: null });
    }
  };

  const hourOptions = hourValues.map(({ hourOffset, description, optionValue }) => (
    <option key={hourOffset} value={optionValue}>
      {description}
    </option>
  ));

  const minuteOptions = [0, 15, 30, 45].map((minute) => (
    <option key={minute} value={minute}>
      {minute.toString(10).padStart(2, '0')}
    </option>
  ));

  const hourInputId = useId();
  const minuteInputId = useId();

  const [hourSelect, minuteSelect] = (
    [
      ['Hour', 'hour', hourOptions, hourInputId],
      ['Minute', 'minute', minuteOptions, minuteInputId],
    ] as const
  ).map(([label, name, options, selectId]) => (
    <label className="form-label" key={name} htmlFor={selectId}>
      <span className="visually-hidden">{label}</span>
      <select
        id={selectId}
        className="form-select me-1"
        name={name}
        value={value[name] == null ? '' : value[name]}
        onChange={inputChanged}
      >
        <option aria-label="No value selected" />
        {options}
      </select>
    </label>
  ));

  return (
    <div className="form-inline">
      {hourSelect}
      <span className="mx-1">:</span>
      {minuteSelect}

      {children}
    </div>
  );
}

export default TimeSelect;
