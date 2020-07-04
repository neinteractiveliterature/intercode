import React, { useState, useMemo } from 'react';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { getUnitForValue, UNITS } from '../TimespanItemUtils';
import RequiredIndicator from './RequiredIndicator';
import useUniqueId from '../../useUniqueId';
import { TimespanFormItem } from '../../FormAdmin/FormItemTypes';

export type TimespanItemInputProps = {
  formItem: TimespanFormItem,
  value?: number | null,
  valueInvalid?: boolean,
  onChange: (value: number | null) => void,
  onInteract: (identifier: string) => void,
};

function TimespanItemInput(props: TimespanItemInputProps) {
  const {
    formItem, value, valueInvalid, onChange, onInteract,
  } = props;
  const [unit, setUnit] = useState(() => getUnitForValue(value).name);

  const currentUnit = useMemo(
    () => UNITS.find((u) => unit === u.name) ?? UNITS[0],
    [unit],
  );

  const userDidInteract = () => { onInteract(formItem.identifier); };

  const inputDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.target.value, 10);

    if (Number.isNaN(quantity)) {
      onChange(null);
    } else {
      onChange(quantity * currentUnit.length_seconds);
    }

    userDidInteract();
  };

  const unitSelectorDidChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUnit(event.target.value);
  };

  const inputId = useUniqueId('timespan-input-');
  const labelId = useUniqueId('timespan-label-');

  const options = UNITS.map((u) => (
    <option key={u.name} value={u.name}>
      {u.name}
      (s)
    </option>
  ));

  let inputValue: string;
  if (value == null) {
    inputValue = '';
  } else {
    inputValue = `${value / currentUnit.length_seconds}`;
  }

  return (
    <div className="form-group">
      <label id={labelId} htmlFor={inputId} className="form-item-label">
        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: formItem.properties.caption }}
        />
        <RequiredIndicator formItem={formItem} />
      </label>
      <div className="d-flex">
        <div className="w-25">
          <input
            id={inputId}
            type="number"
            min="1"
            className={classNames('form-control', { 'is-invalid': valueInvalid })}
            value={inputValue}
            onChange={inputDidChange}
            onBlur={userDidInteract}
            aria-labelledby={labelId}
          />
          <FieldRequiredFeedback valueInvalid={valueInvalid ?? false} />
        </div>
        <select
          className="form-control ml-2"
          value={unit}
          onChange={unitSelectorDidChange}
        >
          {options}
        </select>
      </div>
    </div>
  );
}

export default TimespanItemInput;
