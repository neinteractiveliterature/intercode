/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class BootstrapFormInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    helpText: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    disabled: false,
    helpText: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();

    const { helpText, label, ...otherProps } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={inputId}>{label}</label>
        <input
          className="form-control"
          id={inputId}
          {...otherProps}
        />
        {
          helpText
            ? <small className="form-text text-muted">{helpText}</small>
            : null
        }
      </div>
    );
  }
}

export default BootstrapFormInput;
