import React from 'react';
import PropTypes from 'prop-types';

import BucketCapacityBar from './BucketCapacityBar';
import pluralizeWithCount from '../../pluralizeWithCount';

function getBucketAvailabilityFraction(bucket, remainingCapacity) {
  if (!bucket.slots_limited) {
    return 1.0;
  }

  if (bucket.total_slots === 0) {
    return 0.0;
  }

  return remainingCapacity / bucket.total_slots;
}

function describeCapacity(bucket, signupCount, signupsAvailable) {
  if (!bucket.slots_limited) {
    if (!signupsAvailable) {
      return 'unlimited';
    }

    return `unlimited (${signupCount} signed up)`;
  }

  const remainingCapacity = bucket.total_slots - signupCount;

  if (!signupsAvailable && remainingCapacity === bucket.total_slots) {
    return pluralizeWithCount('slot', remainingCapacity);
  }

  return `${remainingCapacity > 0 ? remainingCapacity : 0} / ${bucket.total_slots} available`;
}

function RunCapacityGraphBucket({
  bucket, signupCountData, signupsAvailable, bucketIndex,
}) {
  const capacity = bucket.total_slots;

  if (capacity < 1 && bucket.slots_limited) {
    return null;
  }

  const signupCount = signupCountData.sumSignupCounts({ state: 'confirmed', bucket_key: bucket.key });
  const remainingCapacity = bucket.total_slots - signupCount;
  const availabilityFraction = getBucketAvailabilityFraction(bucket, remainingCapacity);
  const tickmarkClass = bucket.total_slots >= 10 ? 'bucket-capacity-tickmark-thin' : '';

  return (
    <div className="bucket-capacity">
      <div className="bucket-capacity-bars">
        <BucketCapacityBar
          className={`bg-bucket-color-${(bucketIndex % 9) + 1}`}
          widthFraction={availabilityFraction}
          tickmarkCount={remainingCapacity}
          tickmarkClass={tickmarkClass}
          startingTickmarkIndex={1}
        />
        {
          signupCount > 0
            ? (
              <BucketCapacityBar
                className="bg-bucket-color-full"
                widthFraction={1.0 - availabilityFraction}
                tickmarkCount={signupCount}
                tickmarkClass={tickmarkClass}
              />
            )
            : null
        }
      </div>
      {bucket.name}
      {': '}
      {describeCapacity(bucket, signupCount, signupsAvailable)}
    </div>
  );
}

RunCapacityGraphBucket.propTypes = {
  bucket: PropTypes.shape({
    total_slots: PropTypes.number.isRequired,
    slots_limited: PropTypes.bool.isRequired,
  }).isRequired,
  signupCountData: PropTypes.shape({}).isRequired,
  signupsAvailable: PropTypes.bool.isRequired,
  bucketIndex: PropTypes.number.isRequired,
};

export default RunCapacityGraphBucket;
