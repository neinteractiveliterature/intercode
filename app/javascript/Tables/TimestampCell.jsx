import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import AppRootContext from '../AppRootContext';

export function SingleLineTimestampCell({ value }) {
  const { timezoneName } = useContext(AppRootContext);
  const timestamp = moment.tz(value, timezoneName);
  return (
    <>
      {timestamp.format('YYYY-MM-DD HH:mm')}
    </>
  );
}

SingleLineTimestampCell.propTypes = {
  value: PropTypes.string.isRequired,
};

function TimestampCell({ value }) {
  const { timezoneName } = useContext(AppRootContext);
  const timestamp = moment.tz(value, timezoneName);
  return (
    <>
      {timestamp.format('MMM D, YYYY')}
      <br />
      {timestamp.format('h:mm:ssa')}
    </>
  );
}

TimestampCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default TimestampCell;
