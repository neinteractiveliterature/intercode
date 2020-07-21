import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import RunCapacityGraphBucket from './RunCapacityGraphBucket';
import SignupCountData from '../SignupCountData';
import sortBuckets from './sortBuckets';
import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';

function RunCapacityGraph({ run, event, signupsAvailable }) {
  const { t } = useTranslation();
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
        {t(
          'events.runCapacity.waitlistCount',
          'Waitlist - {{ waitlistCount }}',
          { waitlistCount: signupCountData.getWaitlistCount() },
        )}
        <BucketAvailabilityDisplay
          className="text-secondary"
          signupCount={signupCountData.getWaitlistCount()}
          remainingCapacity={0}
        />
      </div>
    </div>
  );
}

RunCapacityGraph.propTypes = {
  run: PropTypes.shape({
    signup_count_by_state_and_bucket_key_and_counted: PropTypes.string.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    registration_policy: PropTypes.shape({
      buckets: PropTypes.arrayOf(PropTypes.shape({
        slots_limited: PropTypes.bool.isRequired,
        anything: PropTypes.bool,
        name: PropTypes.string.isRequired,
      }).isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  signupsAvailable: PropTypes.bool.isRequired,
};

export default RunCapacityGraph;
