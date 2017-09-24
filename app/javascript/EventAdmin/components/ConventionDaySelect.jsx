import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';
import { propType } from 'graphql-anywhere';
import moment from 'moment';
import { fragments } from '../eventsQuery';
import { timespanFromConvention } from '../TimespanUtils';

class ConventionDaySelect extends React.Component {
  static propTypes = {
    convention: propType(fragments.conventionFragment).isRequired,
    value: MomentPropTypes.momentObj,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  onChange = (event) => {
    const newDayString = event.target.value;

    if (newDayString != null) {
      this.props.onChange(moment(newDayString).tz(this.props.convention.timezone_name));
    } else {
      this.props.onChange(null);
    }
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
