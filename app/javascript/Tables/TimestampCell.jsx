import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { QueryDataContext } from './useReactTableWithTheWorks';

function TimestampCell({ value }) {
  const data = useContext(QueryDataContext);
  const timestamp = moment.tz(value, data.convention.timezone_name);
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
