import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

export function describeDate(value, timezoneName) {
  return moment.tz(value, timezoneName).format('dddd, MMMM D, YYYY');
}

function DateItemDisplay({ convention, value }) {
  const formattedDate = useMemo(
    () => describeDate(value, convention.timezone_name),
    [convention.timezone_name, value],
  );

  return formattedDate;
}

DateItemDisplay.propTypes = {
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
};

export default DateItemDisplay;
