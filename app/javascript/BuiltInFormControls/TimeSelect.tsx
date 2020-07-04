import React, { useMemo, SetStateAction, ReactNode } from 'react';

import { getMemoizationKeyForTimespan } from '../TimespanUtils';
import useUniqueId from '../useUniqueId';
import { FiniteTimespan } from '../Timespan';
import { lowercaseMeridiem } from '../TimeUtils';

export type TimeValues = {
  hour?: number,
  minute?: number,
};

export type TimeSelectProps = {
  value: TimeValues,
  onChange: React.Dispatch<SetStateAction<TimeValues>>,
  timespan: FiniteTimespan,
  children?: ReactNode,
};

type HourOption = {
  hourOffset: number,
  description: string,
  optionValue: number,
};

function TimeSelect({
  value, timespan, onChange, children,
}: TimeSelectProps) {
  const hourValues = useMemo(
    () => {
      let hourOffset = 0;
      const options: HourOption[] = [];
      while (timespan.start.plus({ hours: hourOffset }) < timespan.finish) {
        const now = timespan.start.plus({ hours: hourOffset });
        const dayDiff = now.diff(timespan.start.startOf('day'), 'days').days;
        let description = lowercaseMeridiem(now.toFormat('ha'));
        if (dayDiff >= 1) {
          description += ` (+${Math.floor(dayDiff)} ${dayDiff >= 2 ? 'days' : 'day'})`;
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

  const inputChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    <option key={minute} value={minute}>{minute.toString(10).padStart(2, '0')}</option>
  ));

  const hourInputId = useUniqueId('hour-');
  const minuteInputId = useUniqueId('minute-');

  const selectorData: [string, string, JSX.Element[], string][] = [
    ['Hour', 'hour', hourOptions, hourInputId],
    ['Minute', 'minute', minuteOptions, minuteInputId],
  ];

  const [hourSelect, minuteSelect] = selectorData.map(([label, name, options, selectId]) => (
    <label key={name} htmlFor={selectId}>
      <span className="sr-only">{label}</span>
      <select
        id={selectId}
        className="form-control mr-1"
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
