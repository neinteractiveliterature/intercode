import React, { useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import SignupCountData from '../SignupCountData';
import { ScheduleGridContext } from './ScheduleGridContext';
import Timespan from '../../Timespan';
import EventRun from './PCSG/EventRun';
import Schedule from './Schedule';
import { SignupState } from '../../graphqlTypes.generated';

function buildHourRunData(eventRun: EventRun, schedule: Schedule) {
  const run = schedule.getRun(eventRun.runId)!;
  const event = schedule.getEvent(run.event_id)!;
  const signupCountData = SignupCountData.fromRun(run);
  return {
    eventRun, run, event, signupCountData,
  };
}

export type ScheduleGridExtendedCountsProps = {
  now: DateTime,
  eventRuns: EventRun[],
};

function ScheduleGridExtendedCounts({ now, eventRuns }: ScheduleGridExtendedCountsProps) {
  const { schedule } = useContext(ScheduleGridContext);

  const hourTimespan = useMemo(
    () => new Timespan(now, now.plus({ hours: 1 })),
    [now],
  );
  const hourEventRuns = useMemo(
    () => eventRuns.filter((eventRun) => hourTimespan.overlapsTimespan(eventRun.timespan)),
    [eventRuns, hourTimespan],
  );
  const hourRunData = useMemo(
    () => hourEventRuns.map((eventRun) => buildHourRunData(eventRun, schedule)),
    [hourEventRuns, schedule],
  );

  const minimumSlots = hourRunData.reduce(
    (sum, runData) => sum + (runData.event.registration_policy?.minimum_slots ?? 0),
    0,
  );

  const preferredSlots = hourRunData.reduce(
    (sum, runData) => sum + (runData.event.registration_policy?.preferred_slots ?? 0),
    0,
  );

  const totalSlots = hourRunData.reduce(
    (sum, runData) => sum + (runData.event.registration_policy?.total_slots ?? 0),
    0,
  );

  const confirmedSignups = hourRunData.reduce(
    (sum, { signupCountData }) => (
      sum + signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: true })
    ),
    0,
  );

  const notCountedSignups = hourRunData.reduce(
    (sum, { signupCountData }) => (
      sum + signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: false })
    ),
    0,
  );

  const waitlistedSignups = hourRunData.reduce(
    (sum, { signupCountData }) => sum + signupCountData.getWaitlistCount(),
    0,
  );

  const playerCount = confirmedSignups + notCountedSignups + waitlistedSignups;

  return (
    <div className="schedule-grid-hour-extended-counts">
      <div>
        {minimumSlots}
        /
        {preferredSlots}
        /
        {totalSlots}
      </div>
      <div>
        <span className="text-success">{confirmedSignups}</span>
        /
        <span className="text-info">{notCountedSignups}</span>
        /
        <span className="text-danger">{waitlistedSignups}</span>
      </div>
      <div>
        Total:
        {' '}
        {playerCount}
      </div>
    </div>
  );
}

export default ScheduleGridExtendedCounts;
