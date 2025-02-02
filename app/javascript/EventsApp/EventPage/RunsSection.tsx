import { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import RunCapacityGraph from './RunCapacityGraph';
import EventPageRunCard from './EventPageRunCard';
import { EventPageQueryData } from './queries.generated';
import { SignupAutomationMode } from '../../graphqlTypes.generated';

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
  data: EventPageQueryData;
};

export default function RunsSection({ data }: RunsSectionProps) {
  const sortedRuns = useMemo(
    () => sortBy(data.convention.event.runs, (run) => DateTime.fromISO(run.starts_at).toMillis()),
    [data],
  );

  const addToQueue = useMemo(() => {
    if (data.convention.signup_automation_mode !== SignupAutomationMode.RankedChoice) {
      return false;
    }

    return data.convention.my_profile?.signup_constraints.at_maximum_signups ?? false;
  }, [data.convention.my_profile?.signup_constraints.at_maximum_signups, data.convention.signup_automation_mode]);

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
            signupRounds={data.convention.signup_rounds}
            currentAbility={currentAbility}
            addToQueue={addToQueue}
          />
        ))
      )}
    </div>
  );
}
