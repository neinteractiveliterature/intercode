import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import moment from 'moment-timezone';
import CaptionLegend from './CaptionLegend';

class DateItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
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

  onChange = (newValue) => {
    this.props.onChange(newValue.toISOString());
  }

  render = () => (
    <fieldset className="form-group">
      <CaptionLegend formItem={this.props.formItem} />
      <Datetime
        value={moment(this.props.value)}
        onChange={this.onChange}
        isValidDate={this.isValidDate}
        dateFormat="MMMM D, YYYY"
        timeFormat={false}
      />
    </fieldset>
  )
}

export default DateItem;
