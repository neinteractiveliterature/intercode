import { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import buildBlankSignupCountsFromRegistrationPolicy from './buildBlankSignupCountsFromRegistrationPolicy';
import RunCapacityGraph from './RunCapacityGraph';
import EventPageRunCard from './EventPageRunCard';
import { EventPageQueryData, useEventPageQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

type FakeRunProps = {
  event: EventPageQueryData['convention']['event'];
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
  eventId: string;
};

export default LoadQueryWithVariablesWrapper(
  useEventPageQuery,
  ({ eventId }: RunsSectionProps) => ({ eventId }),
  function RunsSection({ data }) {
    const sortedRuns = useMemo(
      () => sortBy(data.convention.event.runs, (run) => DateTime.fromISO(run.starts_at).toMillis()),
      [data],
    );

    const { currentAbility, convention } = data;
    const myProfile = convention.my_profile;
    const event = convention.event;

    const showFakeRun =
      sortedRuns.length === 0 || (convention?.site_mode === 'convention' && !currentAbility.can_read_schedule);

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
  },
);
