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
  };

  static defaultProps = {
    disabled: false,
    type: 'checkbox',
    className: '',
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();
    const { className, label, ...otherProps } = this.props;

    return (
      <div className={`form-check ${className}`}>
        <label className="form-check-label" htmlFor={inputId}>
          <input
            className="form-check-input"
            id={inputId}
            {...otherProps}
          />
          {' '}
          {label}
        </label>
      </div>
    );
  }
}

export default BootstrapFormCheckbox;
