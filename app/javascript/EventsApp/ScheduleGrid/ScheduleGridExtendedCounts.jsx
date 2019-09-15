import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import MomentPropTypes from 'react-moment-proptypes';

import SignupCountData from '../SignupCountData';
import { ScheduleGridContext } from './ScheduleGridContext';
import Timespan from '../../Timespan';

function buildHourRunData(eventRun, schedule) {
  const run = schedule.getRun(eventRun.runId);
  const event = schedule.getEvent(run.event_id);
  const signupCountData = SignupCountData.fromRun(run);
  return {
    eventRun, run, event, signupCountData,
  };
}

function ScheduleGridExtendedCounts({ now, eventRuns }) {
  const { convention: { timezone_name: timezoneName }, schedule } = useContext(ScheduleGridContext);

  const nowISOString = now.toISOString();
  const hourTimespan = useMemo(
    () => {
      const nowMoment = moment.tz(nowISOString, timezoneName);
      return new Timespan(nowMoment, nowMoment.clone().add(1, 'hour'));
    },
    [nowISOString, timezoneName],
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
    (sum, runData) => sum + runData.event.registration_policy.minimum_slots,
    0,
  );

  const preferredSlots = hourRunData.reduce(
    (sum, runData) => sum + runData.event.registration_policy.preferred_slots,
    0,
  );

  const totalSlots = hourRunData.reduce(
    (sum, runData) => sum + runData.event.registration_policy.total_slots,
    0,
  );

  const confirmedSignups = hourRunData.reduce(
    (sum, { signupCountData }) => (
      sum + signupCountData.sumSignupCounts({ state: 'confirmed', counted: true })
    ),
    0,
  );

  const notCountedSignups = hourRunData.reduce(
    (sum, { signupCountData }) => (
      sum + signupCountData.sumSignupCounts({ state: 'confirmed', counted: false })
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
        {'/'}
        <span className="text-info">{notCountedSignups}</span>
        {'/'}
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

ScheduleGridExtendedCounts.propTypes = {
  now: MomentPropTypes.momentObj.isRequired,
  eventRuns: PropTypes.arrayOf(PropTypes.shape({
    runId: PropTypes.number.isRequired,
    timespan: PropTypes.shape({}).isRequired,
  })).isRequired,
};

export default ScheduleGridExtendedCounts;
