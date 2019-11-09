/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import useUniqueId from '../useUniqueId';

function BootstrapFormCheckbox(props) {
  const {
    className,
    inputClassName,
    label,
    onChange,
    onCheckedChange,
    ...otherProps
  } = props;

  const inputId = useUniqueId(otherProps.name ? `${otherProps.name}-` : 'checkbox-');
  const onChangeProp = onChange || ((event) => { onCheckedChange(event.target.checked); });

  return (
    <div className={classnames('form-check', className)}>
      <label className="form-check-label" htmlFor={inputId}>
        <input
          className={classnames('form-check-input', inputClassName)}
          id={inputId}
          onChange={onChangeProp}
          {...otherProps}
        />
        {' '}
        {label}
      </label>
    </div>
  );
}

BootstrapFormCheckbox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  onCheckedChange: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['radio', 'checkbox']),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

BootstrapFormCheckbox.defaultProps = {
  disabled: false,
  type: 'checkbox',
  className: '',
  inputClassName: '',
  name: null,
  onChange: null,
  onCheckedChange: null,
};

export default BootstrapFormCheckbox;
