/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

function BootstrapFormInput(props) {
  const inputId = useUniqueId(`${props.name || 'input'}-`);

  const {
    helpText, label, hideLabel, invalidFeedback, onChange, onTextChange, ...otherProps
  } = props;

  const onChangeProp = onChange || ((event) => { onTextChange(event.target.value); });

  return (
    <div className="form-group">
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : null}>{label}</label>
      <input
        className="form-control"
        id={inputId}
        onChange={onChangeProp}
        {...otherProps}
      />
      <HelpText>{helpText}</HelpText>
      {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    </div>
  );
}

BootstrapFormInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  hideLabel: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onTextChange: PropTypes.func,
  helpText: PropTypes.node,
  disabled: PropTypes.bool,
  invalidFeedback: PropTypes.node,
};

BootstrapFormInput.defaultProps = {
  name: null,
  hideLabel: false,
  type: 'text',
  disabled: false,
  helpText: null,
  onChange: null,
  onTextChange: null,
  invalidFeedback: null,
};

export default BootstrapFormInput;
