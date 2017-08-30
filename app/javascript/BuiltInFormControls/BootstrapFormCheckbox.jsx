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
  };

  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  render = () => {
    const inputId = this.nextUniqueId();

    return (
      <div className="form-check">
        <label className="form-check-label" htmlFor={inputId}>
          <input
            className="form-check-input"
            id={inputId}
            name={this.props.name}
            type="checkbox"
            checked={this.props.checked}
            onChange={this.props.onChange}
            disabled={this.props.disabled}
            {...this.props}
          />
          {' '}
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default BootstrapFormCheckbox;
