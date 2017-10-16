/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class BootstrapFormInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    type: 'text',
    disabled: false,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={inputId}>{this.props.label}</label>
        <input
          className="form-control"
          id={inputId}
          {...this.props}
        />
      </div>
    );
  }
}

export default BootstrapFormInput;
