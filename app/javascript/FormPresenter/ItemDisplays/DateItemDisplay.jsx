import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

class DateItemDisplay extends React.PureComponent {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string,
      }).isRequired,
    }).isRequired,
    convention: PropTypes.shape({
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.string.isRequired,
  };


  render = () => (
    <React.Fragment>
      {moment.tz(this.props.value, this.props.convention.timezone_name).format('dddd, MMMM D YYYY')}
    </React.Fragment>
  )
}

export default DateItemDisplay;
