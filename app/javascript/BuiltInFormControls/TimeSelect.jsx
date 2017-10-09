import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

class TimeSelect extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      hour: PropTypes.number,
      minute: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    timespan: PropTypes.shape({
      start: MomentPropTypes.momentObj,
      finish: MomentPropTypes.momentObj,
    }).isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  inputChanged = (event) => {
    const newValue = event.target.value;

    if (newValue && newValue !== '') {
      this.props.onChange(
        { ...this.props.value, [event.target.name]: parseInt(newValue, 10) },
      );
    } else {
      this.props.onChange(
        { ...this.props.value, [event.target.name]: null },
      );
    }
  }

  render = () => {
    const { value, timespan } = this.props;

    const hourOptions = [];
    let hourOffset = 0;
    while (timespan.start.clone().add(hourOffset, 'hours').isBefore(timespan.finish)) {
      const now = timespan.start.clone().add(hourOffset, 'hours');
      const dayDiff = now.diff(timespan.start.clone().startOf('day'), 'days');
      let description = `${now.hour()}`;
      if (dayDiff > 0) {
        description += ` (+${dayDiff} ${dayDiff > 1 ? 'days' : 'day'})`;
      }

      hourOptions.push(
        <option key={hourOffset} value={hourOffset + timespan.start.hour()}>
          {description}
        </option>,
      );
      hourOffset += 1;
    }

    const minuteOptions = [0, 15, 30, 45].map(minute => (
      <option key={minute} value={minute}>{minute.toString(10).padStart(2, '0')}</option>
    ));

    return (
      <div className="form-inline">
        <label className="sr-only">Hour</label>
        <select
          className="form-control mr-1"
          name="hour"
          value={value.hour == null ? '' : value.hour}
          onChange={this.inputChanged}
        >
          <option />
          {hourOptions}
        </select>

        <span className="mx-1">:</span>

        <label className="sr-only">Minute</label>
        <select
          className="form-control mr-1"
          name="minute"
          value={value.minute == null ? '' : value.minute}
          onChange={this.inputChanged}
        >
          <option />
          {minuteOptions}
        </select>

        {this.props.children}
      </div>
    );
  }
}

export default TimeSelect;
