import { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import AppRootContext from '../../AppRootContext';

export function describeDate(value, timezoneName) {
  return moment.tz(value, timezoneName).format('dddd, MMMM D, YYYY');
}

function DateItemDisplay({ value }) {
  const { timezoneName } = useContext(AppRootContext);
  const formattedDate = useMemo(
    () => describeDate(value, timezoneName),
    [timezoneName, value],
  );

  return formattedDate;
}

DateItemDisplay.propTypes = {
  value: PropTypes.string.isRequired,
};

export default DateItemDisplay;
