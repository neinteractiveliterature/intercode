import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import buildSignupOptions from './buildSignupOptions';
import { EventPageQuery } from './queries.gql';
import RunCapacityGraph from './RunCapacityGraph';
import RunCard from './RunCard';
import useQuerySuspended from '../../useQuerySuspended';
import ErrorDisplay from '../../ErrorDisplay';
import buildEventUrl from '../buildEventUrl';

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

function RunsSection({ eventId }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  const sortedRuns = useMemo(
    () => (error
      ? null
      : [...data.event.runs].sort((a, b) => (
        moment.tz(a.starts_at, data.convention.timezone_name).valueOf()
        - moment.tz(b.starts_at, data.convention.timezone_name).valueOf()
      ))
    ),
    [data, error],
  );
  const signupOptions = useMemo(
    () => (error ? null : buildSignupOptions(data.event, data.myProfile)),
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    currentAbility, myProfile, convention, event,
  } = data;
  const eventPath = buildEventUrl(event);

  const showFakeRun = (
    sortedRuns.length === 0
    || (convention.site_mode === 'convention' && !currentAbility.can_read_schedule)
  );

  return (
    <section className="my-4">
      <hr />

      <div className="d-flex flex-wrap justify-content-center">
        {showFakeRun
          ? <FakeRun event={event} />
          : sortedRuns.map(run => (
            <RunCard
              event={event}
              eventPath={eventPath}
              run={run}
              timezoneName={convention.timezone_name}
              key={run.id}
              myProfile={myProfile}
              currentAbility={currentAbility}
              signupOptions={signupOptions}
            />
          ))
        }
      </div>
    </section>
  );
}

RunsSection.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default RunsSection;
