import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import Datetime from 'react-datetime';
require('react-datetime/css/react-datetime.css');
import NumberInput from 'react-number-input';
import maxBy from 'lodash.maxby';
import { TimespanPropType, ScheduledValuePropType } from './ScheduledValuePropTypes';

class TimespanRow extends React.Component {
  static propTypes = {
    timespan: TimespanPropType.isRequired,
    otherTimespans: PropTypes.arrayOf(TimespanPropType.isRequired).isRequired,
    timezone: PropTypes.string.isRequired,
    attributeDidChange: PropTypes.func.isRequired,
  }

  static isValid = (timespan) => {
    if (!timespan.value) {
      return false;
    }

    return true;
  }

  timeChanged = (property, newTime) => {
    var value = null;
    if (newTime) {
      value = newTime.tz(this.props.timezone).toISOString();
    }

    this.props.attributeDidChange(property, value);
  }

  valueChanged = (e, value) => {
    var newValue = Object.assign({}, this.props.timespan.value || {});
    newValue.fractional = value * 100.0;
    this.props.attributeDidChange('value', newValue);
  }

  isBeforeFinishTime = (date) => {
    var finishTime = this.getFinishTime();
    return (!finishTime || date.isBefore(finishTime));
  }

  isAfterStartTime = (date) => {
    var startTime = this.getStartTime();
    return (!startTime || date.isAfter(startTime));
  }

  doesNotOverlapOtherTimespans = (date) => {
    return this.props.otherTimespans.every((otherTimespan) => {
      if (otherTimespan.start) {
        if (date.isSame(otherTimespan.start)) {
          return false;
        }

        if (otherTimespan.finish) {
          if (date.isBetween(otherTimespan.start, otherTimespan.finish)) {
            return false;
          }
        } else {
          if (date.isAfter(otherTimespan.start)) {
            return false;
          }
        }
      } else if (otherTimespan.finish) {
        if (date.isBefore(otherTimespan.finish)) {
          return false;
        }
      }

      return true;
    });
  }

  isValidStartTime = (date) => {
    return (this.isBeforeFinishTime(date) && this.doesNotOverlapOtherTimespans(date));
  }

  isValidFinishTime = (date) => {
    return (this.isAfterStartTime(date) && this.doesNotOverlapOtherTimespans(date));
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

  componentWillReceiveProps = (newProps) => {
    this.startTime = null;
    this.finishTime = null;
  }

  render = () => {
    let dollarValue = null;

    if (this.props.timespan.value && this.props.timespan.value.fractional !== null) {
      dollarValue = (this.props.timespan.value.fractional / 100.0).toFixed(2);
    }

    return (
      <tr>
        <td className="col-md-3">
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

        <td className="col-md-4">
          <div className="media" style={{overflow: "visible"}}>
            <div className="media-left" style={{verticalAlign: "middle"}}>from</div>
            <div className="media-body" style={{overflow: "visible"}}>
              <Datetime value={this.getStartTime()}
                onChange={this.timeChanged.bind(this, 'start')}
                isValidDate={this.isValidStartTime} />
            </div>
          </div>
        </td>

        <td className="col-md-4">
          <div className="media" style={{overflow: "visible"}}>
            <div className="media-left" style={{verticalAlign: "middle"}}>to</div>
            <div className="media-body" style={{overflow: "visible"}}>
              <Datetime value={this.getFinishTime()}
                onChange={this.timeChanged.bind(this, 'finish')}
                isValidDate={this.isValidFinishTime} />
            </div>
          </div>
        </td>

        <td className="col-md-1 text-right">
          <button className="btn btn-danger" onClick={this.props.deleteClicked}>
            <i className="fa fa-trash-o"/>
          </button>
        </td>
      </tr>
    );
  }
}

class ScheduledValueEditor extends React.Component {
  static propTypes = {
    scheduledValue: ScheduledValuePropType.isRequired,
    timezone: PropTypes.string.isRequired,
  }

  static isValid = (scheduledValue) => {
    if (!scheduledValue.timespans || scheduledValue.timespans.length < 1) {
      return false;
    }

    return scheduledValue.timespans.every(function (timespan) {
      if (!TimespanRow.isValid(timespan)) {
        return false;
      }

      return true;
    });
  }

  addRowClicked = (e) => {
    e.preventDefault();

    var timespans = this.props.scheduledValue.timespans || [];

    var newTimespans = [...timespans];
    var lastTimespan = maxBy(timespans, (timespan) => moment(timespan.finish).toDate());
    var everyTimespanFinishes = timespans.every((timespan) => timespan.finish);

    var startTime = null;
    if (lastTimespan && everyTimespanFinishes) {
      startTime = lastTimespan.finish;
    }

    newTimespans.push({ start: startTime, finish: null, value: null });

    this.setTimespans(newTimespans);
  }

  deleteRowClicked = (index, e) => {
    e.preventDefault();

    var oldTimespans = this.props.scheduledValue.timespans;
    var newTimespans = oldTimespans.slice(0, index).concat(oldTimespans.slice(index + 1));

    this.setTimespans(newTimespans);
  }

  setTimespans = (newTimespans) => {
    var newScheduledValue = Object.assign({}, this.props.scheduledValue, {timespans: newTimespans});
    this.props.setScheduledValue(newScheduledValue);
  }

  timespanAttributeDidChange = (index, attributeName, newValue) => {
    var newTimespans = [...this.props.scheduledValue.timespans];
    newTimespans[index] = Object.assign({}, newTimespans[index], {[attributeName]: newValue});

    this.setTimespans(newTimespans);
  }

  render = () => {
    var timespans = this.props.scheduledValue.timespans || [];

    var timespanRows = timespans.map(function (timespan, i) {
      var otherTimespans = timespans.slice(0, i).concat(timespans.slice(i+1));

      return <TimespanRow
        timespan={timespan}
        otherTimespans={otherTimespans}
        timezone={this.props.timezone}
        key={i}
        deleteClicked={this.deleteRowClicked.bind(this, i)}
        attributeDidChange={this.timespanAttributeDidChange.bind(this, i)}/>;
    }.bind(this));

    return (
      <table className="table table-striped">
        <tbody>
          {timespanRows}
          <tr>
            <td colSpan="4">
              <button className="btn btn-link" onClick={this.addRowClicked}>Add row</button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ScheduledValueEditor;