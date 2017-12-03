import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import moment from 'moment-timezone';
import { timespanFromConvention } from '../TimespanUtils';

class ConventionDaySelect extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    value: MomentPropTypes.momentObj,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  onChange = (event) => {
    const newDayString = event.target.value;

    this.props.onChange(moment(newDayString).tz(this.props.convention.timezone_name));
  }

  render = () => {
    const { convention } = this.props;
    const conventionTimespan = timespanFromConvention(convention);
    const conventionDays = conventionTimespan.getTimeHopsWithin(convention.timezone_name, 'day');

    const options = conventionDays.map(day => (
      <div className="form-check form-check-inline" key={day.toISOString()}>
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="radio"
            name="day"
            value={day.toISOString()}
            checked={day.isSame(this.props.value)}
            onChange={this.onChange}
          />
          {' '}
          {day.format('dddd')}
        </label>
      </div>
    ));

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend">Day</legend>
        {options}
      </fieldset>
    );
  }
}

export default ConventionDaySelect;
