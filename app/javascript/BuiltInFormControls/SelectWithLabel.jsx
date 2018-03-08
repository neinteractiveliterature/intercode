/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { enableUniqueIds } from 'react-html-id';

class SelectWithLabel extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const { label, ...otherProps } = this.props;
    const selectId = this.nextUniqueId();

    return (
      <div className="form-group">
        <label htmlFor={selectId}>
          {label}
        </label>
        <Select id={selectId} {...otherProps} />
      </div>
    );
  }
}

export default SelectWithLabel;
