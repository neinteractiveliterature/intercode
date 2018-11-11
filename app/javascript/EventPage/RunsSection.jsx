import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import buildSignupOptions from './buildSignupOptions';
import RunCapacityGraph from './RunCapacityGraph';
import RunCard from './RunCard';

function FakeRun({ event }) {
  const blankSignupCountsByBucketKeyAndCounted = event.registration_policy.buckets
    .reduce((signupCountByBucketAndCounted, bucket) => ({
      ...signupCountByBucketAndCounted,
      [bucket.key]: { counted: 0, not_counted: 0 },
    }), {});

  return (
    <div className="col-lg-4 col-md-6 col-sm-12">
      <RunCapacityGraph
        event={event}
        run={{
          signup_count_by_state_and_bucket_key_and_counted: JSON.stringify({
            confirmed: blankSignupCountsByBucketKeyAndCounted,
            waitlisted: blankSignupCountsByBucketKeyAndCounted,
          }),
        }}
        signupsAvailable={false}
      />
    </div>
  );
}

function RunsSection({ event, myProfile, currentAbility, timezoneName }) {
  const acceptsSignups = (
    !event.registration_policy.slots_limited
    || event.registration_policy.total_slots_including_not_counted > 0
  );

  if (!acceptsSignups) {
    return null;
  }

  const sortedRuns = [...event.runs]
    .sort((a, b) => moment.tz(a.starts_at, timezoneName).valueOf()
      - moment.tz(b.starts_at, timezoneName).valueOf());

  const signupOptions = buildSignupOptions(event, myProfile);

  return (
    <section className="my-4">
      <hr />

      <div className="d-flex flex-wrap justify-content-center">
        {
          sortedRuns.length > 0 && currentAbility.can_read_schedule
            ? sortedRuns.map(run => (
              <RunCard
                event={event}
                run={run}
                timezoneName={timezoneName}
                key={run.id}
                currentAbility={currentAbility}
                signupOptions={signupOptions}
              />
            ))
            : <FakeRun event={event} />
        }
      </div>
    </section>
  );
}

export default RunsSection;
