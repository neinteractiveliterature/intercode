import React from 'react';
import PropTypes from 'prop-types';

import { formatBucket } from '../EventsApp/SignupAdmin/SignupUtils';

const BucketChangeCell = ({ value }) => {
  const oldBucket = value.previous_signup_change
    ? formatBucket(value.previous_signup_change, value.run.event)
    : null;
  const newBucket = formatBucket(value, value.run.event);

  return (
    <>
      {(oldBucket && oldBucket !== newBucket) && (
        <>
          <s>{oldBucket}</s>
          <br />
        </>
      )}
      {newBucket}
    </>
  );
};

BucketChangeCell.propTypes = {
  value: PropTypes.shape({
    previous_signup_change: PropTypes.shape({}),
    run: PropTypes.shape({
      event: PropTypes.shape({}).isRequired,
    }).isRequired,
  }).isRequired,
};

export default BucketChangeCell;
