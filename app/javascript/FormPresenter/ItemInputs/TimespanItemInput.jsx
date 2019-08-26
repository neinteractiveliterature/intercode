import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { getUnitForValue, UNITS } from '../TimespanItemUtils';
import RequiredIndicator from './RequiredIndicator';
import useUniqueId from '../../useUniqueId';

function TimespanItemInput(props) {
  const {
    formItem, value, valueInvalid, onChange, onInteract,
  } = props;
  const [unit, setUnit] = useState(() => getUnitForValue(value).name);

  const currentUnit = useMemo(
    () => UNITS.find((u) => unit === u.name),
    [unit],
  );

  const userDidInteract = () => { onInteract(formItem.identifier); };

  const inputDidChange = (event) => {
    const quantity = parseInt(event.target.value, 10);

    if (Number.isNaN(quantity)) {
      onChange(null);
    } else {
      onChange(quantity * currentUnit.length_seconds);
    }

    userDidInteract();
  };

  const unitSelectorDidChange = (event) => {
    setUnit(event.target.value);
  };

  const inputId = useUniqueId('timespan-input-');

  const options = UNITS.map((u) => (
    <option key={u.name} value={u.name}>
      {u.name}
      (s)
    </option>
  ));

  let inputValue;
  if (value === null) {
    inputValue = '';
  } else {
    inputValue = value / currentUnit.length_seconds;
  }

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-item-label">
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
          />
          <FieldRequiredFeedback valueInvalid={valueInvalid} />
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

TimespanItemInput.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  value: PropTypes.number,
  valueInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onInteract: PropTypes.func.isRequired,
};

TimespanItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default TimespanItemInput;
