import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import { useISODateTimeInAppZone } from '../TimeUtils';

export function SingleLineTimestampCell({ value }) {
  const timestamp = useISODateTimeInAppZone(value);

  if (!timestamp.isValid) {
    return null;
  }

  return (
    <>
      {timestamp.toFormat('yyyy-MM-dd HH:mm')}
    </>
  );
}

SingleLineTimestampCell.propTypes = {
  value: PropTypes.string.isRequired,
};

function TimestampCell({ value }) {
  const timestamp = useISODateTimeInAppZone(value);

  if (!timestamp.isValid) {
    return null;
  }

  return (
    <>
      {timestamp.toLocaleString(DateTime.DATE_MED)}
      <br />
      {timestamp.toFormat('h:mm:ssa').toLowerCase()}
    </>
  );
}

TimestampCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default TimestampCell;
