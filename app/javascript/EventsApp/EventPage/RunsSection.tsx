import { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

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

  return (
    <div className="run-card col-lg-4 col-md-6 col-sm-12">
      <RunCapacityGraph event={event} run={{ grouped_signup_counts: [] }} signupsAvailable={false} />
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
