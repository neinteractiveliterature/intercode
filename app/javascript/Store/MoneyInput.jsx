import React, { useState } from 'react';
import PropTypes from 'prop-types';

import formatMoney from '../formatMoney';
import { parseFloatOrNull } from '../ComposableFormUtils';

function MoneyInput({ value, onChange, id }) {
  const [inputValue, setInputValue] = useState(formatMoney(value, false));
  const inputChanged = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const floatValue = parseFloatOrNull(newValue);
    if (floatValue) {
      onChange({ fractional: Math.floor(floatValue * 100.0), currency_code: 'USD' });
    } else {
      onChange(null);
    }
  };

  return (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">$</span>
      </div>
      { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <input
        type="text"
        className="form-control"
        value={inputValue}
        onChange={inputChanged}
        id={id}
      />
    </div>
  );
}

MoneyInput.propTypes = {
  value: PropTypes.shape({
    fractional: PropTypes.number.isRequired,
    currency_code: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
};

MoneyInput.defaultProps = {
  value: null,
  id: null,
};

export default MoneyInput;
