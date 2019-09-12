import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';

function BootstrapFormTextarea(props) {
  const {
    name, value, label, disabled, onChange, onTextChange, ...otherProps
  } = props;
  const inputId = useUniqueId(`${name}-`);

  const onChangeProp = useMemo(
    () => onChange || ((event) => { onTextChange(event.target.value); }),
    [onChange, onTextChange],
  );

  return (
    <div className="form-group">
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : null}>{label}</label>
      <textarea
        className="form-control"
        id={inputId}
        name={name}
        value={value}
        onChange={onChangeProp}
        disabled={disabled}
        {...otherProps}
      />
    </div>
  );
}

BootstrapFormTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
  disabled: PropTypes.bool,
};

BootstrapFormTextarea.defaultProps = {
  disabled: false,
  hideLabel: false,
  onChange: null,
  onTextChange: null,
};

export default BootstrapFormTextarea;
