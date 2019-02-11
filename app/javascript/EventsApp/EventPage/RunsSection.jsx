import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import buildSignupOptions from './buildSignupOptions';
import RunCapacityGraph from './RunCapacityGraph';
import RunCard from './RunCard';

function FakeRun({ event }) {
  const blankSignupCountsByBucketKeyAndCounted = buildBlankSignupCountsFromRegistrationPolicy(
    event.registration_policy,
  );

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

FakeRun.propTypes = {
  event: PropTypes.shape({
    registration_policy: PropTypes.shape({
      buckets: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }).isRequired,
};

function RunsSection({
  event, eventPath, myProfile, currentAbility, timezoneName,
}) {
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
                eventPath={eventPath}
                run={run}
                timezoneName={timezoneName}
                key={run.id}
                myProfile={myProfile}
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

RunsSection.propTypes = {
  event: PropTypes.shape({
    registration_policy: PropTypes.shape({
      slots_limited: PropTypes.bool.isRequired,
      total_slots_including_not_counted: PropTypes.number.isRequired,
    }).isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
  myProfile: PropTypes.shape({}),
  currentAbility: PropTypes.shape({
    can_read_schedule: PropTypes.bool.isRequired,
  }).isRequired,
  timezoneName: PropTypes.string.isRequired,
};

RunsSection.defaultProps = {
  myProfile: null,
};

export default RunsSection;
