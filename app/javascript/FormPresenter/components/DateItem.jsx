import React from 'react';
import PropTypes from 'prop-types';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
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
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  onChange = (event) => {
    this.props.onChange(event.target.value);
  }

  render = () => (
    <fieldset className="form-group">
      <CaptionLegend formItem={this.props.formItem} />
      <input
        type="date"
        value={this.props.value}
        onChange={this.onChange}
        className="form-control"
      />
    </fieldset>
  )
}

export default DateItem;
