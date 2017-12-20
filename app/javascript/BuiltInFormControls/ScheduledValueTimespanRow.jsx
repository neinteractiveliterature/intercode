import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { TimespanPropType } from '../ScheduledValuePropTypes';
import ScheduledValueTimespanRowDatepicker from './ScheduledValueTimespanRowDatepicker';
import Timespan from '../PCSG/Timespan';

require('moment-timezone');

function getOppositeTimeFieldName(fieldName) {
  switch (fieldName) {
    case 'start':
      return 'finish';
    case 'finish':
      return 'start';
    default:
      return null;
  }
}

class ScheduledValueTimespanRow extends React.Component {
  static propTypes = {
    buildInput: PropTypes.func.isRequired,
    rowIdentifier: PropTypes.number.isRequired,
    timespan: TimespanPropType.isRequired,
    otherTimespans: PropTypes.arrayOf(TimespanPropType.isRequired).isRequired,
    timezone: PropTypes.string.isRequired,
    attributeDidChange: PropTypes.func.isRequired,
    deleteClicked: PropTypes.func.isRequired,
  }

  static isValid = (timespan) => {
    if (!timespan.value) {
      return false;
    }

    return true;
  }

  getTimeField = (fieldName) => {
    const fieldValue = this.props.timespan[fieldName];
    if (!fieldValue) {
      return null;
    }

    return moment(fieldValue).tz(this.props.timezone);
  }

  isValidTimeForField = (fieldName, date) => {
    const prospectiveTimespan = new Timespan({
      start: moment(this.props.timespan.start),
      finish: moment(this.props.timespan.finish),
      [fieldName]: date,
    });

    if (!this.doesNotOverlapOtherTimespans(prospectiveTimespan)) {
      return false;
    }

    const oppositeTime = this.getTimeField(getOppositeTimeFieldName(fieldName));
    if (!oppositeTime) {
      return true;
    }

    switch (fieldName) {
      case 'start':
        if (date.isAfter(oppositeTime)) {
          return false;
        }
        break;
      case 'finish':
        if (date.isBefore(oppositeTime)) {
          return false;
        }
        break;
      default:
        return true;
    }

    return true;
  }

  timeChanged = (property, newTime) => {
    let value = null;
    if (newTime) {
      const newTimeInTimezone = moment.tz(newTime.toObject(), this.props.timezone);
      value = newTimeInTimezone.toISOString();
    }

    this.props.attributeDidChange(this.props.rowIdentifier, property, value);
  }

  valueChanged = (value) => {
    this.props.attributeDidChange(this.props.rowIdentifier, 'value', value);
  }

  doesNotOverlapOtherTimespans = prospectiveTimespan =>
    this.props.otherTimespans.every((otherTimespanProps) => {
      const otherTimespan = new Timespan({
        start: moment(otherTimespanProps.start),
        finish: moment(otherTimespanProps.finish),
      });

      return !prospectiveTimespan.overlapsTimespan(otherTimespan);
    });

  renderDatetimePicker = fieldName => (
    <ScheduledValueTimespanRowDatepicker
      fieldName={fieldName}
      value={this.getTimeField(fieldName)}
      onChange={this.timeChanged}
      validateDate={this.isValidTimeForField}
    />
  )

  render = () => (
    <tr>
      <td className="w-25">
        {this.props.buildInput(this.props.timespan.value, this.valueChanged)}
      </td>

      <td className="w-75">
        <div className="d-flex flex-row align-items-center justify-content-stretch">
          <div>from&nbsp;</div>
          {this.renderDatetimePicker('start')}
          <div className="ml-4">to&nbsp;</div>
          {this.renderDatetimePicker('finish')}
        </div>
      </td>

      <td className="w-25 text-right" style={{ verticalAlign: 'middle' }}>
        <button className="btn btn-danger btn-sm" onClick={this.props.deleteClicked}>
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  )
}

export default ScheduledValueTimespanRow;
