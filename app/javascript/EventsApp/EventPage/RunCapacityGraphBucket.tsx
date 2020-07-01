import React from 'react';

import pluralizeWithCount from '../../pluralizeWithCount';
import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';
import { RegistrationPolicyBucket, SignupState } from '../../graphqlTypes.generated';
import SignupCountData from '../SignupCountData';

function describeCapacity(
  bucket: Pick<RegistrationPolicyBucket, 'slots_limited' | 'total_slots'>,
  signupCount: number,
  signupsAvailable: boolean,
) {
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

export type RunCapacityGraphBucketProps = {
  bucket: Pick<RegistrationPolicyBucket, 'key' | 'name' | 'total_slots' | 'slots_limited'>,
  signupCountData: SignupCountData,
  signupsAvailable: boolean,
  bucketIndex: number,
};

function RunCapacityGraphBucket({
  bucket, signupCountData, signupsAvailable, bucketIndex,
}: RunCapacityGraphBucketProps) {
  const capacity = bucket.total_slots;

  if ((capacity != null && capacity < 1) && bucket.slots_limited) {
    return null;
  }

  const signupCount = signupCountData.sumSignupCounts({
    state: SignupState.Confirmed,
    bucket_key: bucket.key,
  });
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

export default RunCapacityGraphBucket;
