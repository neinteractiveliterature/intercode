import { useMemo, useContext } from 'react';
import moment from 'moment-timezone';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import RunCapacityGraph from './RunCapacityGraph';
import ErrorDisplay from '../../ErrorDisplay';
import EventPageRunCard from './EventPageRunCard';
import LoadingIndicator from '../../LoadingIndicator';
import AppRootContext from '../../AppRootContext';
import { EventPageQueryQuery, useEventPageQueryQuery } from './queries.generated';

type FakeRunProps = {
  event: EventPageQueryQuery['event'];
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
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useEventPageQueryQuery({ variables: { eventId } });

  const sortedRuns = useMemo(
    () =>
      error || loading || !data
        ? []
        : [...data.event.runs].sort(
            (a, b) =>
              moment.tz(a.starts_at, timezoneName).valueOf() -
              moment.tz(b.starts_at, timezoneName).valueOf(),
          ),
    [data, error, loading, timezoneName],
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
