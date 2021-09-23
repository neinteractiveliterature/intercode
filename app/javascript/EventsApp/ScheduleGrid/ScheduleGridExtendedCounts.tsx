import { useMemo, useContext } from 'react';
import { DateTime } from 'luxon';

import SignupCountData from '../SignupCountData';
import { ScheduleGridContext } from './ScheduleGridContext';
import Timespan from '../../Timespan';
import Schedule from './Schedule';
import AppRootContext from '../../AppRootContext';
import { SignupState } from '../../graphqlTypes.generated';

function buildHourRunData(runId: number, schedule: Schedule) {
  const run = schedule.getRun(runId)!;
  const event = schedule.getEvent(run.event_id)!;
  const signupCountData = SignupCountData.fromRun(run);
  return {
    run,
    event,
    signupCountData,
  };
}

export type ScheduleGridExtendedCountsProps = {
  now: DateTime;
  runIds: number[];
};

function ScheduleGridExtendedCounts({ now, runIds }: ScheduleGridExtendedCountsProps) {
  const { schedule } = useContext(ScheduleGridContext);
  const { timezoneName } = useContext(AppRootContext);

  const hourTimespan = useMemo(
    () => new Timespan(now, now.setZone(timezoneName).plus({ hours: 1 })),
    [now, timezoneName],
  );
  const hourRunIds = useMemo(() => {
    const runIdsFromSchedule = new Set(schedule.getRunIdsOverlapping(hourTimespan));
    return runIds.filter((runId) => runIdsFromSchedule.has(runId));
  }, [hourTimespan, schedule, runIds]);
  const hourRunData = useMemo(
    () => hourRunIds.map((runId) => buildHourRunData(runId, schedule)),
    [hourRunIds, schedule],
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
    (sum, { signupCountData }) =>
      sum + signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: true }),
    0,
  );

  const notCountedSignups = hourRunData.reduce(
    (sum, { signupCountData }) =>
      sum + signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: false }),
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
        {minimumSlots}/{preferredSlots}/{totalSlots}
      </div>
      <div>
        <span className="text-success">{confirmedSignups}</span>/
        <span className="text-info">{notCountedSignups}</span>/
        <span className="text-danger">{waitlistedSignups}</span>
      </div>
      <div>Total: {playerCount}</div>
    </div>
  );
}

export default ScheduleGridExtendedCounts;
