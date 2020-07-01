import React from 'react';

import RunCapacityGraphBucket from './RunCapacityGraphBucket';
import SignupCountData from '../SignupCountData';
import sortBuckets from './sortBuckets';
import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';
import { EventPageEventFieldsFragment } from './queries.generated';

export type RunCapacityGraphProps = {
  run: Parameters<typeof SignupCountData.fromRun>[0],
  event: Pick<EventPageEventFieldsFragment, 'registration_policy'>,
  signupsAvailable: boolean,
};

function RunCapacityGraph({ run, event, signupsAvailable }: RunCapacityGraphProps) {
  const signupCountData = SignupCountData.fromRun(run);

  return (
    <div className="run-capacity bg-white rounded mb-2" style={{ overflow: 'hidden' }}>
      {sortBuckets((event.registration_policy || {}).buckets || []).map((bucket, bucketIndex) => (
        <RunCapacityGraphBucket
          bucket={bucket}
          signupCountData={signupCountData}
          key={bucket.key}
          signupsAvailable={signupsAvailable}
          bucketIndex={bucketIndex}
        />
      ))}
      <div className="bucket-capacity">
        Waitlist
        {' - '}
        {signupCountData.getWaitlistCount()}
        <BucketAvailabilityDisplay
          className="text-secondary"
          signupCount={signupCountData.getWaitlistCount()}
          remainingCapacity={0}
        />
      </div>
    </div>
  );
}

export default RunCapacityGraph;
