import React, { useState } from 'react';
import PropTypes from 'prop-types';

import formatMoney from '../formatMoney';
import { parseFloatOrNull } from '../ComposableFormUtils';

const MoneyInput = React.forwardRef(({
  value, onChange, appendContent, inputGroupClassName, ...inputProps
}, ref) => {
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
    <div className={inputGroupClassName || 'input-group'}>
      <div className="input-group-prepend">
        <span className="input-group-text">$</span>
      </div>
      { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <input
        type="text"
        className="form-control"
        value={inputValue}
        onChange={inputChanged}
        ref={ref}
        {...inputProps}
      />
      {appendContent && (
        <div className="input-group-append">{appendContent}</div>
      )}
    </div>
  );
});

MoneyInput.propTypes = {
  value: PropTypes.shape({
    fractional: PropTypes.number.isRequired,
    currency_code: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  appendContent: PropTypes.node,
  inputGroupClassName: PropTypes.string,
};

MoneyInput.defaultProps = {
  value: null,
  appendContent: null,
  inputGroupClassName: null,
};

export default MoneyInput;
