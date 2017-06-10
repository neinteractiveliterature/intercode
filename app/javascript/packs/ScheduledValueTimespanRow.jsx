import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import NumberInput from 'react-number-input';
import { TimespanPropType } from './ScheduledValuePropTypes';

require('moment-timezone');
require('react-datetime/css/react-datetime.css');

class ScheduledValueTimespanRow extends React.Component {
  static propTypes = {
    key: PropTypes.number.isRequired,
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

  componentWillReceiveProps = () => {
    this.startTime = null;
    this.finishTime = null;
  }

  getStartTime = () => {
    if (!this.startTime && this.props.timespan.start) {
      this.startTime = moment(this.props.timespan.start).tz(this.props.timezone);
    }

    return this.startTime;
  }

  getFinishTime = () => {
    if (!this.finishTime && this.props.timespan.finish) {
      this.finishTime = moment(this.props.timespan.finish).tz(this.props.timezone);
    }

    return this.finishTime;
  }

  isValidStartTime = date => (
    this.isBeforeFinishTime(date) && this.doesNotOverlapOtherTimespans(date)
  )

  isValidFinishTime = date => (
    this.isAfterStartTime(date) && this.doesNotOverlapOtherTimespans(date)
  )

  timeChanged = (property, newTime) => {
    let value = null;
    if (newTime) {
      value = newTime.tz(this.props.timezone).toISOString();
    }

    this.props.attributeDidChange(this.props.key, property, value);
  }

  startTimeChanged = (newTime) => {
    this.timeChanged('start', newTime);
  }

  finishTimeChanged = (newTime) => {
    this.timeChanged('finish', newTime);
  }

  valueChanged = (e, value) => {
    const newValue = Object.assign(
      {},
      this.props.timespan.value || {},
      { fractional: value * 100.0 },
    );
    this.props.attributeDidChange(this.props.key, 'value', newValue);
  }

  isBeforeFinishTime = (date) => {
    const finishTime = this.getFinishTime();
    return (!finishTime || date.isBefore(finishTime));
  }

  isAfterStartTime = (date) => {
    const startTime = this.getStartTime();
    return (!startTime || date.isAfter(startTime));
  }

  doesNotOverlapOtherTimespans = date => this.props.otherTimespans.every((otherTimespan) => {
    if (otherTimespan.start) {
      if (date.isSame(otherTimespan.start)) {
        return false;
      }

      if (otherTimespan.finish) {
        if (date.isBetween(otherTimespan.start, otherTimespan.finish)) {
          return false;
        }
      } else if (date.isAfter(otherTimespan.start)) {
        return false;
      }
    } else if (otherTimespan.finish) {
      if (date.isBefore(otherTimespan.finish)) {
        return false;
      }
    }

    return true;
  })

  render = () => {
    let dollarValue = null;

    if (this.props.timespan.value && this.props.timespan.value.fractional !== null) {
      dollarValue = (this.props.timespan.value.fractional / 100.0).toFixed(2);
    }

    return (
      <tr>
        <td className="w-25">
          <div className="input-group">
            <span className="input-group-addon">$</span>
            <NumberInput
              className="form-control"
              value={dollarValue}
              onChange={this.valueChanged}
              format="0,0.00"
            />
          </div>
        </td>

        <td className="w-75">
          <div className="d-flex flex-row align-items-center justify-content-stretch">
            <div>from&nbsp;</div>
            <Datetime
              value={this.getStartTime()}
              onChange={this.startTimeChanged}
              isValidDate={this.isValidStartTime}
            />
            <div className="ml-4">to&nbsp;</div>
            <Datetime
              value={this.getFinishTime()}
              onChange={this.finishTimeChanged}
              isValidDate={this.isValidFinishTime}
            />
          </div>
        </td>

        <td className="w-25 text-right" style={{ verticalAlign: 'middle' }}>
          <button className="btn btn-danger btn-sm" onClick={this.props.deleteClicked}>
            <i className="fa fa-trash-o" />
          </button>
        </td>
      </tr>
    );
  }
}

export default ScheduledValueTimespanRow;
