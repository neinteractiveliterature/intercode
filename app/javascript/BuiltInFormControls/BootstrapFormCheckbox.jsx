/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class BootstrapFormCheckbox extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    onChangeChecked: PropTypes.func,
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
    name: null,
    onChange: null,
    onChangeChecked: null,
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
      onChange,
      onChangeChecked,
      ...otherProps
    } = this.props;

    const onChangeProp = onChange || ((event) => { onChangeChecked(event.target.checked); });

    return (
      <div className={`form-check ${className}`}>
        <label className="form-check-label" htmlFor={inputId}>
          <input
            className={`form-check-input ${inputClassName}`}
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
}

export default BootstrapFormCheckbox;
