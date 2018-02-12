import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

// from https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function compact(object) {
  const myObj = { ...object };
  Object.keys(myObj).forEach(key => (myObj[key] == null) && delete myObj[key]);
  return myObj;
}

class DateTimeInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    timezoneName: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);

    this.state = this.parseDateTimeValues(props.value, props.timezoneName);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(compact(this.parseDateTimeValues(nextProps.value, nextProps.timezoneName)));
  }

  parseDateTimeValues = (valueString, timezoneName) => {
    const parsedValue = moment.tz(valueString, timezoneName);

    if (!parsedValue.isValid()) {
      return {
        date: null,
        time: null,
      };
    }

    return {
      date: parsedValue.format('YYYY-MM-DD'),
      time: parsedValue.format('HH:mm:ss'),
    };
  }

  dateChanged = (event) => {
    this.setState({ date: event.target.value }, this.sendOnChangeFromState);
  }

  timeChanged = (event) => {
    this.setState({ time: event.target.value }, this.sendOnChangeFromState);
  }

  sendOnChangeFromState = () => {
    const momentValue = moment.tz(
      `${this.state.date}, ${this.state.time}`,
      'YYYY-MM-DD HH:mm:ss',
      this.props.timezoneName,
    );

    this.props.onChange(momentValue.toISOString());
  }

  render = () => {
    return (
      <div className="d-flex">
        <input
          type="date"
          className="form-control mr-1"
          value={this.state.date}
          onChange={this.dateChanged}
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        />
        <input
          type="time"
          className="form-control"
          value={this.state.time}
          onChange={this.timeChanged}
          pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
        />
      </div>
    );
  }
};

export default DateTimeInput;
