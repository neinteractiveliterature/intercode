import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

function DateItemDisplay({ convention, value }) {
  const formattedDate = useMemo(
    () => moment.tz(value, convention.timezone_name).format('dddd, MMMM D, YYYY'),
    [convention.timezone_name, value],
  );

  return (
    <>
      {formattedDate}
    </>
  );
}

DateItemDisplay.propTypes = {
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.string.isRequired,
};

export default DateItemDisplay;
