import React from 'react';
import PropTypes from 'prop-types';
import DateTimeInput from './DateTimeInput';

class ScheduledValueTimespanRowDatepicker extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    timezoneName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  datetimeValueChanged = (newValue) => {
    this.props.onChange(this.props.fieldName, newValue);
  }

  render = () => (
    <div className="d-flex">
      <DateTimeInput
        value={this.props.value}
        timezoneName={this.props.timezoneName}
        onChange={this.datetimeValueChanged}
      />
    </div>
  )
}

export default ScheduledValueTimespanRowDatepicker;
