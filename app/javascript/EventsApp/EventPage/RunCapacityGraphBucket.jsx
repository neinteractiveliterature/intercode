import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';

function describeCapacity(bucket, signupCount, signupsAvailable, t) {
  if (!bucket.slots_limited) {
    if (!signupsAvailable) {
      return t('events.runCapacity.unlimitedSimple', 'unlimited');
    }

    return t('events.runCapacity.unlimitedWithCount', 'unlimited ({{ signupCount }} signed up)', { signupCount });
  }

  if (bucket.total_slots == null) {
    return t('events.runCapacity.zeroCapacity', '0 slots');
  }

  const remainingCapacity = bucket.total_slots - signupCount;

  if (!signupsAvailable && remainingCapacity === bucket.total_slots) {
    return t('events.runCapacity.slotCount', '{{ count }} slots', { count: remainingCapacity });
  }

  const displayCount = signupCount > bucket.total_slots ? bucket.total_slots : signupCount;

  return t(
    'events.runCapacity.slotRemainingCount',
    '{{ filledCount }} of {{ count }} slots filled',
    { count: bucket.total_slots, filledCount: displayCount },
  );
}

function RunCapacityGraphBucket({
  bucket, signupCountData, signupsAvailable, bucketIndex,
}) {
  const { t } = useTranslation();
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
      {describeCapacity(bucket, signupCount, signupsAvailable, t)}
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
