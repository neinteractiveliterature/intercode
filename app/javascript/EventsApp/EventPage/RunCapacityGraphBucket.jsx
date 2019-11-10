import React from 'react';
import PropTypes from 'prop-types';

import pluralizeWithCount from '../../pluralizeWithCount';
import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';

function describeCapacity(bucket, signupCount, signupsAvailable) {
  if (!bucket.slots_limited) {
    if (!signupsAvailable) {
      return 'unlimited';
    }

    return `unlimited (${signupCount} signed up)`;
  }

  if (bucket.total_slots == null) {
    return '0 slots';
  }

  const remainingCapacity = bucket.total_slots - signupCount;

  if (!signupsAvailable && remainingCapacity === bucket.total_slots) {
    return pluralizeWithCount('slot', remainingCapacity);
  }

  const displayCount = signupCount > bucket.total_slots ? bucket.total_slots : signupCount;

  return `${displayCount} of ${pluralizeWithCount('slot', bucket.total_slots)} filled`;
}

function RunCapacityGraphBucket({
  bucket, signupCountData, signupsAvailable, bucketIndex,
}) {
  const capacity = bucket.total_slots;

  if (capacity < 1 && bucket.slots_limited) {
    return null;
  }

  const signupCount = signupCountData.sumSignupCounts({ state: 'confirmed', bucket_key: bucket.key });
  const remainingCapacity = (bucket.total_slots || 0) - signupCount;

  return (
    <div className="bucket-capacity">
      {bucket.name}
      {' - '}
      {describeCapacity(bucket, signupCount, signupsAvailable)}
      <BucketAvailabilityDisplay
        className={`text-bucket-color-${(bucketIndex % 9) + 1}`}
        signupCount={signupCount}
        remainingCapacity={remainingCapacity}
      />
    </div>
  );
}

RunCapacityGraphBucket.propTypes = {
  bucket: PropTypes.shape({
    total_slots: PropTypes.number,
    slots_limited: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  signupCountData: PropTypes.shape({
    sumSignupCounts: PropTypes.func.isRequired,
  }).isRequired,
  signupsAvailable: PropTypes.bool.isRequired,
  bucketIndex: PropTypes.number.isRequired,
};

export default RunCapacityGraphBucket;
