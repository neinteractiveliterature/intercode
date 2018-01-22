import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import { enableUniqueIds } from 'react-html-id';

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

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  inputChanged = (event) => {
    const newValue = event.target.value;

    if (newValue && newValue !== '') {
      this.props.onChange({ ...this.props.value, [event.target.name]: parseInt(newValue, 10) });
    } else {
      this.props.onChange({ ...this.props.value, [event.target.name]: null });
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

      hourOptions.push((
        <option key={hourOffset} value={hourOffset + timespan.start.hour()}>
          {description}
        </option>
      ));
      hourOffset += 1;
    }

    const minuteOptions = [0, 15, 30, 45].map(minute => (
      <option key={minute} value={minute}>{minute.toString(10).padStart(2, '0')}</option>
    ));

    const [hourSelect, minuteSelect] = [
      ['Hour', 'hour', hourOptions],
      ['Minute', 'minute', minuteOptions],
    ].map(([label, name, options]) => {
      const selectId = this.nextUniqueId();

      return (
        <label key={name} htmlFor={selectId}>
          <span className="sr-only">{label}</span>
          <select
            id={selectId}
            className="form-control mr-1"
            name={name}
            value={value[name] == null ? '' : value[name]}
            onChange={this.inputChanged}
          >
            <option />
            {options}
          </select>
        </label>
      );
    });

    return (
      <div className="form-inline">
        {hourSelect}
        <span className="mx-1">:</span>
        {minuteSelect}

        {this.props.children}
      </div>
    );
  }
}

export default TimeSelect;
