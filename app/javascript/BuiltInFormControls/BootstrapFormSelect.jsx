/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import useUniqueId from '../useUniqueId';

function BootstrapFormSelect(props) {
  const { onChange, onValueChange, ...otherProps } = props;
  const inputId = useUniqueId(props.name ? `${props.name}-` : 'select-');
  const onChangeProp = onChange || ((event) => { onValueChange(event.target.value); });

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{props.label}</label>
      <select
        className="form-control"
        id={inputId}
        onChange={onChangeProp}
        {...otherProps}
      />
    </div>
  );
}

BootstrapFormSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

BootstrapFormSelect.defaultProps = {
  children: null,
  disabled: false,
  name: null,
  onChange: null,
  onValueChange: null,
};

export default BootstrapFormSelect;
