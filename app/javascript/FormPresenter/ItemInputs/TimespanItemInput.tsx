import { useState, useMemo, ChangeEvent, useId } from 'react';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { getUnitForValue, isUnitName, UNITS } from '../TimespanItemUtils';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { TimespanFormItem } from '../../FormAdmin/FormItemUtils';
import CaptionLabel from './CaptionLabel';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type TimespanItemInputProps = CommonFormItemInputProps<TimespanFormItem>;

function TimespanItemInput(props: TimespanItemInputProps): React.JSX.Element {
  const { formItem, formTypeIdentifier, value: uncheckedValue, valueInvalid, onChange, onInteract } = props;
  const value = useMemo(() => uncheckedValue ?? null, [uncheckedValue]);
  const [unit, setUnit] = useState(() => getUnitForValue(value).name);

  const currentUnit = useMemo(() => UNITS.find((u) => unit === u.name), [unit]);

  const userDidInteract = () => {
    onInteract(formItem.identifier);
  };

  const inputDidChange = (event: ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.target.value, 10);

    if (Number.isNaN(quantity) || !currentUnit) {
      onChange(null);
    } else {
      onChange(quantity * currentUnit.length_seconds);
    }

    userDidInteract();
  };

  const unitSelectorDidChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (isUnitName(value)) {
      setUnit(value);
    }
  };

  const inputId = useId();

  const options = UNITS.map((u) => (
    <option key={u.name} value={u.name}>
      {u.name}
      (s)
    </option>
  ));

  let inputValue: string;
  if (value === null || !currentUnit) {
    inputValue = '';
  } else {
    inputValue = (value / currentUnit.length_seconds).toString();
  }

  return (
    <div className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
        <CaptionLabel formItem={formItem} htmlFor={inputId} />
        <div className="d-flex">
          <div className="w-25">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <input
              id={inputId}
              type="number"
              min="1"
              className={classNames('form-control', { 'is-invalid': valueInvalid })}
              value={inputValue}
              onChange={inputDidChange}
              onBlur={userDidInteract}
            />
            <FieldRequiredFeedback valueInvalid={valueInvalid} />
          </div>
          <select className="form-select ms-2" value={unit} onChange={unitSelectorDidChange} aria-label="Unit of time">
            {options}
          </select>
        </div>
      </VisibilityDisclosureCard>
    </div>
  );
}

export default TimespanItemInput;
