import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import MomentPropTypes from 'react-moment-proptypes';

import 'react-datetime/css/react-datetime.css';
import '../react-datetime-width-fix.css';

class ScheduledValueTimespanRowDatepicker extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    value: MomentPropTypes.momentObj,
    onChange: PropTypes.func.isRequired,
    validateDate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  datetimeValueChanged = (newValue) => {
    this.props.onChange(this.props.fieldName, newValue);
  }

  isValidDate = date => this.props.validateDate(this.props.fieldName, date)

  render = () => (
    <Datetime
      value={this.props.value}
      onChange={this.datetimeValueChanged}
      isValidDate={this.isValidDate}
    />
  )
}

export default ScheduledValueTimespanRowDatepicker;
