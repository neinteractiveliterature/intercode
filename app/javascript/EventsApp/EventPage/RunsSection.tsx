import { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import RunCapacityGraph from './RunCapacityGraph';
import EventPageRunCard from './EventPageRunCard';
import { EventPageQueryData, useEventPageQuery } from './queries.generated';

type FakeRunProps = {
  event: EventPageQueryData['event'];
};

function FakeRun({ event }: FakeRunProps) {
  if (!event.registration_policy) {
    return <></>;
  }

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
  eventId: number;
};

function RunsSection({ eventId }: RunsSectionProps) {
  const { data, loading, error } = useEventPageQuery({ variables: { eventId } });

  const sortedRuns = useMemo(
    () =>
      error || loading || !data
        ? []
        : sortBy(data.event.runs, (run) => DateTime.fromISO(run.starts_at).toMillis()),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { currentAbility, myProfile, convention, event } = data!;

  const showFakeRun =
    sortedRuns.length === 0 ||
    (convention?.site_mode === 'convention' && !currentAbility.can_read_schedule);

  return (
    <div className="run-card-deck">
      {showFakeRun ? (
        <FakeRun event={event} />
      ) : (
        sortedRuns.map((run) => (
          <EventPageRunCard
            event={event}
            run={run}
            key={run.id}
            myProfile={myProfile}
            currentAbility={currentAbility}
          />
        ))
      )}
    </div>
  );
}

export default RunsSection;
