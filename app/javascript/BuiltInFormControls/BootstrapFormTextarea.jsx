import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';

function BootstrapFormTextarea(props) {
  const {
    name, value, label, hideLabel, helpText,
    disabled, invalidFeedback, onChange, onTextChange, ...otherProps
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
      {
        helpText
          ? <small className="form-text text-muted">{helpText}</small>
          : null
      }
      {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    </div>
  );
}

BootstrapFormTextarea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  helpText: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
  disabled: PropTypes.bool,
  invalidFeedback: PropTypes.node,
};

BootstrapFormTextarea.defaultProps = {
  name: null,
  disabled: false,
  hideLabel: false,
  helpText: null,
  onChange: null,
  onTextChange: null,
  invalidFeedback: null,
};

export default BootstrapFormTextarea;
