import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash-es/debounce';

function SearchInput({
  value, onChange, wait, inputProps, inputGroupProps,
}) {
  const [transientValue, setTransientValue] = useState(value || '');
  const transientValueChanged = useMemo(
    () => debounce(
      (newTransientValue) => {
        onChange(newTransientValue);
      },
      wait,
      { leading: false, trailing: true },
    ),
    [onChange, wait],
  );

  useEffect(
    () => {
      transientValueChanged(transientValue);
      return transientValueChanged.cancel;
    },
    [transientValue, transientValueChanged],
  );

  return (
    <div className="input-group" {...(inputGroupProps || {})}>
      <input
        type="search"
        className="form-control search-input-control"
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        value={transientValue}
        onChange={(event) => setTransientValue(event.target.value)}
        {...(inputProps || {})}
      />
      <span className="input-group-append search-input-addon">
        <span className="input-group-text">
          <i className="fa fa-search" />
        </span>
      </span>
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  wait: PropTypes.number,
  inputProps: PropTypes.shape({}),
  inputGroupProps: PropTypes.shape({}),
};

SearchInput.defaultProps = {
  value: null,
  wait: 100,
  inputProps: {},
  inputGroupProps: {},
};

export default SearchInput;
