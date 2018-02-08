import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CaptionLegend from './CaptionLegend';

class DateItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string,
      }).isRequired,
    }).isRequired,
    value: PropTypes.string,
    valueInvalid: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onInteract: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    valueInvalid: false,
  };

  onChange = (event) => {
    this.props.onChange(event.target.value);
    this.userDidInteract();
  }

  userDidInteract = () => {
    this.props.onInteract(this.props.formItem.identifier);
  }

  render = () => (
    <fieldset className="form-group">
      <CaptionLegend formItem={this.props.formItem} />
      <input
        type="date"
        value={this.props.value}
        onChange={this.onChange}
        onInteract={this.userDidInteract}
        className={classNames('form-control', { 'is-invalid': this.props.valueInvalid })}
      />
    </fieldset>
  )
}

export default DateItem;
