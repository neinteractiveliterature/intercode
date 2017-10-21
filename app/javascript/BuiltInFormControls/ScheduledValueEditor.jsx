import React from 'react';
import PropTypes from 'prop-types';
import maxBy from 'lodash.maxby';
import moment from 'moment-timezone';
import { ScheduledValuePropType } from '../ScheduledValuePropTypes';
import ScheduledValueTimespanRow from './ScheduledValueTimespanRow';

class ScheduledValueEditor extends React.Component {
  static propTypes = {
    scheduledValue: ScheduledValuePropType.isRequired,
    timezone: PropTypes.string.isRequired,
    setScheduledValue: PropTypes.func.isRequired,
    buildValueInput: PropTypes.func.isRequired,
  }

  static isValid = (scheduledValue) => {
    if (!scheduledValue.timespans || scheduledValue.timespans.length < 1) {
      return false;
    }

    return scheduledValue.timespans.every((timespan) => {
      if (!ScheduledValueTimespanRow.isValid(timespan)) {
        return false;
      }

      return true;
    });
  }

  setTimespans = (newTimespans) => {
    const newScheduledValue = Object.assign(
      {},
      this.props.scheduledValue,
      { timespans: newTimespans },
    );
    this.props.setScheduledValue(newScheduledValue);
  }

  addRowClicked = (e) => {
    e.preventDefault();

    const timespans = this.props.scheduledValue.timespans || [];
    const newTimespans = [...timespans];
    const lastTimespan = maxBy(timespans, timespan => moment(timespan.finish).toDate());
    const everyTimespanFinishes = timespans.every(timespan => timespan.finish);

    let startTime = null;
    if (lastTimespan && everyTimespanFinishes) {
      startTime = lastTimespan.finish;
    }

    newTimespans.push({ start: startTime, finish: null, value: null });

    this.setTimespans(newTimespans);
  }

  deleteRowClicked = (index, e) => {
    e.preventDefault();

    const oldTimespans = this.props.scheduledValue.timespans;
    const newTimespans = oldTimespans.slice(0, index).concat(oldTimespans.slice(index + 1));

    this.setTimespans(newTimespans);
  }

  timespanAttributeDidChange = (index, attributeName, newValue) => {
    const newTimespans = [...this.props.scheduledValue.timespans];
    newTimespans[index] = Object.assign({}, newTimespans[index], { [attributeName]: newValue });

    this.setTimespans(newTimespans);
  }

  render = () => {
    const timespans = this.props.scheduledValue.timespans || [];

    const timespanRows = timespans.map((timespan, i) => {
      const otherTimespans = timespans.slice(0, i).concat(timespans.slice(i + 1));

      return (
        <ScheduledValueTimespanRow
          timespan={timespan}
          otherTimespans={otherTimespans}
          timezone={this.props.timezone}
          key={i} // eslint-disable-line react/no-array-index-key
          rowIdentifier={i}
          deleteClicked={this.deleteRowClicked}
          attributeDidChange={this.timespanAttributeDidChange}
          buildInput={this.props.buildValueInput}
        />
      );
    });

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
