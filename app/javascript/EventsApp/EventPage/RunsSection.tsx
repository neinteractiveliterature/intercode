import { useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import RunCapacityGraph from './RunCapacityGraph';
import EventPageRunCard from './EventPageRunCard';
import { EventPageQueryData, useEventPageQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';
import { SignupAutomationMode, SignupRequestState, SignupRound, SignupState } from '../../graphqlTypes.generated';
import { parseSignupRounds } from '../../SignupRoundUtils';

function getMaxSignupCount(signupRounds: Pick<SignupRound, 'start' | 'maximum_event_signups'>[]) {
  const parsedRounds = parseSignupRounds(signupRounds);
  const now = DateTime.local();
  const currentRound = parsedRounds.find((round) => round.timespan.includesTime(now));

  if (currentRound == null) {
    return undefined;
  }

  const strValue = currentRound.maximum_event_signups;

  if (strValue === 'not_now' || strValue === 'not_yet') {
    return 0;
  }

  if (strValue === 'unlimited') {
    return undefined;
  }

  return strValue;
}

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

    const addToQueue = useMemo(() => {
      if (data.convention.signup_automation_mode !== SignupAutomationMode.RankedChoice) {
        return false;
      }

      const maxSignups = getMaxSignupCount(data.convention.signup_rounds);

      if (maxSignups === undefined || Number.isNaN(maxSignups)) {
        return false;
      }

      const confirmedCountedSignups = data.convention.my_signups.filter(
        (signup) => signup.state === SignupState.Confirmed && signup.counted,
      );
      const pendingSignupRequests = data.convention.my_signup_requests.filter(
        (signupRequest) => signupRequest.state === SignupRequestState.Pending,
      );

      return confirmedCountedSignups.length + pendingSignupRequests.length >= maxSignups;
    }, [
      data.convention.signup_automation_mode,
      data.convention.my_signups,
      data.convention.my_signup_requests,
      data.convention.signup_rounds,
    ]);

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
              addToQueue={addToQueue}
            />
          ))
        )}
      </div>
    );
  },
);
