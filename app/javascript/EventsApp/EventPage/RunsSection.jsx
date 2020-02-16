import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { useQuery } from '@apollo/react-hooks';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import { EventPageQuery } from './queries.gql';
import RunCapacityGraph from './RunCapacityGraph';
import ErrorDisplay from '../../ErrorDisplay';
import EventPageRunCard from './EventPageRunCard';
import LoadingIndicator from '../../LoadingIndicator';

function FakeRun({ event }) {
  const blankSignupCountsByBucketKeyAndCounted = buildBlankSignupCountsFromRegistrationPolicy(
    event.registration_policy,
  );

  return (
    <div className="run-card col-lg-4 col-md-6 col-sm-12">
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
  const { data, loading, error } = useQuery(EventPageQuery, { variables: { eventId } });

  const sortedRuns = useMemo(
    () => (error || loading
      ? null
      : [...data.event.runs].sort((a, b) => (
        moment.tz(a.starts_at, data.convention.timezone_name).valueOf()
        - moment.tz(b.starts_at, data.convention.timezone_name).valueOf()
      ))
    ),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    currentAbility, myProfile, convention, event,
  } = data;

  const showFakeRun = (
    sortedRuns.length === 0
    || (convention.site_mode === 'convention' && !currentAbility.can_read_schedule)
  );

  return (
    <div className="run-card-deck">
      {showFakeRun
        ? <FakeRun event={event} />
        : sortedRuns.map((run) => (
          <EventPageRunCard
            event={event}
            run={run}
            key={run.id}
            myProfile={myProfile}
            currentAbility={currentAbility}
          />
        ))}
    </div>
  );
}

RunsSection.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default RunsSection;
