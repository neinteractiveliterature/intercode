import React, { useContext, LegacyRef } from 'react';

import { ScheduleGridContext } from './ScheduleGridContext';
import { userSignupStatus, getRunStyle, getRunClassName } from './StylingUtils';
import { calculateAvailability } from './AvailabilityUtils';
import AvailabilityBar from './AvailabilityBar';
import SignupStatusBadge from './SignupStatusBadge';
import { EventForSchedule, RunForSchedule } from './Schedule';
import SignupCountData from '../SignupCountData';
import RunDimensions from './PCSG/RunDimensions';
import ScheduleLayoutResult from './PCSG/ScheduleLayoutResult';
import { SignupState } from '../../graphqlTypes.generated';

export type RunDisplayProps = {
  event: EventForSchedule,
  run: RunForSchedule,
  signupCountData: SignupCountData,
  toggle: () => any,
  runDimensions: RunDimensions,
  layoutResult: ScheduleLayoutResult,
};

const RunDisplay = React.memo(React.forwardRef(({
  event, run, signupCountData, toggle, runDimensions, layoutResult,
}: RunDisplayProps, ref: LegacyRef<HTMLDivElement>) => {
  const { config } = useContext(ScheduleGridContext);
  const signupStatus = userSignupStatus(run);

  const runStyle = getRunStyle({
    event,
    eventCategory: event.event_category,
    signupStatus,
    config,
    signupCountData,
    runDimensions,
    layoutResult,
    disableDetailsPopup: !!run.disableDetailsPopup,
  });

  const { availabilityFraction, unlimited } = calculateAvailability(event, signupCountData);

  const renderAvailabilityBar = () => {
    if (
      event.registration_policy?.slots_limited
      && event.registration_policy.total_slots_including_not_counted === 0
    ) {
      return null;
    }

    return (
      <AvailabilityBar
        availabilityFraction={availabilityFraction ?? 0.0}
        unlimited={unlimited}
        runStyle={runStyle}
      />
    );
  };

  const renderExtendedCounts = () => {
    if (!config.showExtendedCounts) {
      return null;
    }

    return (
      <div className="event-extended-counts p-1">
        <span className="text-success">
          {signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: true })}
        </span>
        /
        <span className="text-info">
          {signupCountData.sumSignupCounts({ state: SignupState.Confirmed, counted: false })}
        </span>
        /
        <span className="text-danger">
          {signupCountData.getWaitlistCount()}
        </span>
      </div>
    );
  };

  const renderSignupStatusBadge = () => {
    if (!config.showSignupStatusBadge) {
      return null;
    }

    return <SignupStatusBadge signupStatus={signupStatus} myRating={event.my_rating} />;
  };

  return (
    <div
      tabIndex={0}
      className={getRunClassName({
        event, signupStatus, config, signupCountData, unlimited,
      })}
      style={runStyle}
      aria-disabled={run.disableDetailsPopup}
      role="button"
      onClick={run.disableDetailsPopup ? undefined : toggle}
      onKeyDown={(keyEvent) => {
        if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
          keyEvent.preventDefault();
          toggle();
        }
      }}
      ref={ref}
    >
      {renderExtendedCounts()}
      <div className="schedule-grid-event-content">
        {!event.fake && renderAvailabilityBar()}
        {renderSignupStatusBadge()}
        {event.displayTitle || event.title}
      </div>
    </div>
  );
}));

export default RunDisplay;
