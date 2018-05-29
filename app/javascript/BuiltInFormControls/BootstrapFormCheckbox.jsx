/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class BootstrapFormCheckbox extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['radio', 'checkbox']),
    className: PropTypes.string,
    inputClassName: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    type: 'checkbox',
    className: '',
    inputClassName: '',
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();
    const {
      className,
      inputClassName,
      label,
      ...otherProps
    } = this.props;

    return (
      <div className={`form-check ${className}`}>
        <input
          className={`form-check-input ${inputClassName}`}
          id={inputId}
          {...otherProps}
        />
        {' '}
        <label className="form-check-label" htmlFor={inputId}>
          {label}
        </label>
      </div>
    );
  }
}

export default BootstrapFormCheckbox;
