/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class BootstrapFormSelect extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
    disabled: false,
    onChange: null,
    onValueChange: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();
    const { onChange, onValueChange, ...otherProps } = this.props;
    const onChangeProp = onChange || ((event) => { onValueChange(event.target.value); });

    return (
      <div className="form-group">
        <label htmlFor={inputId}>{this.props.label}</label>
        <select
          className="form-control"
          id={inputId}
          onChange={onChangeProp}
          {...otherProps}
        />
      </div>
    );
  }
}

export default BootstrapFormSelect;
