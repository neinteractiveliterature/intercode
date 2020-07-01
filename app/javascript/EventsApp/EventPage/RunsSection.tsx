import React, { useMemo } from 'react';
import { DateTime } from 'luxon';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import RunCapacityGraph from './RunCapacityGraph';
import ErrorDisplay from '../../ErrorDisplay';
import EventPageRunCard from './EventPageRunCard';
import LoadingIndicator from '../../LoadingIndicator';
import { EventPageEventFieldsFragment, useEventPageQueryQuery } from './queries.generated';

type FakeRunProps = {
  event: EventPageEventFieldsFragment,
};

function FakeRun({ event }: FakeRunProps) {
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

export type RunsSectionProps = {
  eventId: number,
};

function RunsSection({ eventId }: RunsSectionProps) {
  const { data, loading, error } = useEventPageQueryQuery({ variables: { eventId } });

  const sortedRuns = useMemo(
    () => (error || loading
      ? null
      : [...(data?.event?.runs ?? [])].sort((a, b) => (
        +DateTime.fromISO(a.starts_at) - +DateTime.fromISO(b.starts_at)
      ))
    ),
    [data?.event?.runs, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    currentAbility, myProfile, convention, event,
  } = data!;

  const showFakeRun = (
    sortedRuns == null
    || sortedRuns.length === 0
    || (convention?.site_mode === 'convention' && !currentAbility.can_read_schedule)
  );

  return (
    <div className="run-card-deck">
      {showFakeRun
        ? <FakeRun event={event!} />
        : sortedRuns?.map((run) => (
          <EventPageRunCard
            event={event!}
            run={run}
            key={run.id}
            myProfile={myProfile}
            currentAbility={currentAbility}
          />
        ))}
    </div>
  );
}

export default RunsSection;
