import React from 'react';
import PropTypes from 'prop-types';
import { sum } from 'lodash';

import RunCapacityGraphBucket from './RunCapacityGraphBucket';
import sortBuckets from './sortBuckets';

function RunCapacityGraph({ run, event, signupsAvailable }) {
  const signupCounts = JSON.parse(run.signup_count_by_state_and_bucket_key_and_counted);
  const waitlistCount = sum(Object.values(signupCounts.waitlisted)
    .map(bucketCounts => sum(Object.values(bucketCounts)
      .map(countsByCounted => Object.values(countsByCounted)))));

  return (
    <div className="run-capacity bg-white rounded mb-2" style={{ overflow: 'hidden' }}>
      {sortBuckets(event.registration_policy.buckets).map((bucket, bucketIndex) => (
        <RunCapacityGraphBucket
          bucket={bucket}
          signupCounts={signupCounts}
          key={bucket.key}
          signupsAvailable={signupsAvailable}
          bucketIndex={bucketIndex}
        />
      ))}
      {
        waitlistCount > 0
          ? (
            <div className="bucket-capacity">
              Waitlist:
              {' '}
              {waitlistCount}
            </div>
          )
          : null
      }
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
        anything: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  signupsAvailable: PropTypes.bool.isRequired,
};

export default RunCapacityGraph;
