import React from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';
import useDebouncedState from '../useDebouncedState';

function SearchInput({
  value, onChange, wait, name, label, inputProps, inputGroupProps,
}) {
  const [transientValue, setTransientValue] = useDebouncedState(value || '', onChange, wait);
  const inputId = useUniqueId(`${name || 'search'}-`);

  return (
    <div className="form-group mb-0">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <div className="input-group" {...(inputGroupProps || {})}>
        <input
          id={inputId}
          type="search"
          className="form-control search-input-control"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          value={transientValue}
          name={name}
          onChange={(event) => setTransientValue(event.target.value)}
          {...(inputProps || {})}
        />
        <span className="input-group-append search-input-addon">
          <span className="input-group-text">
            <i className="fa fa-search" />
          </span>
        </span>
      </div>
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  wait: PropTypes.number,
  name: PropTypes.string,
  inputProps: PropTypes.shape({}),
  inputGroupProps: PropTypes.shape({}),
};

SearchInput.defaultProps = {
  value: null,
  wait: 100,
  name: null,
  inputProps: {},
  inputGroupProps: {},
};

export default SearchInput;
