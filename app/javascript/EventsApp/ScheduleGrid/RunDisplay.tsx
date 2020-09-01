import React, { useContext } from 'react';

import { ScheduleGridContext } from './ScheduleGridContext';
import { userSignupStatus, getRunStyle, getRunClassName } from './StylingUtils';
import { calculateAvailability } from './AvailabilityUtils';
import AvailabilityBar from './AvailabilityBar';
import SignupStatusBadge from './SignupStatusBadge';
import { ScheduleEvent, ScheduleRun } from './Schedule';
import SignupCountData from '../SignupCountData';
import { ScheduleLayoutResult, RunDimensions } from './ScheduleLayout/ScheduleLayoutBlock';
import { SignupState } from '../../graphqlTypes.generated';

export type RunDisplayProps = {
  event: ScheduleEvent;
  run: ScheduleRun;
  signupCountData: SignupCountData;
  toggle: () => void;
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
};

const RunDisplay = React.memo(
  React.forwardRef<HTMLDivElement, RunDisplayProps>(
    ({ event, run, signupCountData, toggle, runDimensions, layoutResult }, ref) => {
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
        disableDetailsPopup: run.disableDetailsPopup ?? false,
      });

      const { availabilityFraction, unlimited } = calculateAvailability(event, signupCountData);

      const renderAvailabilityBar = () => {
        if (
          event.registration_policy?.slots_limited &&
          event.registration_policy?.total_slots_including_not_counted === 0
        ) {
          return null;
        }

        return (
          <AvailabilityBar
            availabilityFraction={availabilityFraction}
            unlimited={unlimited ?? false}
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
            /<span className="text-danger">{signupCountData.getWaitlistCount()}</span>
          </div>
        );
      };

      const renderSignupStatusBadge = () => {
        if (!config.showSignupStatusBadge) {
          return null;
        }

        return (
          <SignupStatusBadge signupStatus={signupStatus} myRating={event.my_rating ?? undefined} />
        );
      };

      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={run.disableDetailsPopup ? undefined : 0}
          className={getRunClassName({
            event,
            signupStatus: signupStatus ?? undefined,
            config,
            signupCountData,
            unlimited: unlimited ?? false,
          })}
          style={runStyle}
          role={run.disableDetailsPopup ? undefined : 'button'}
          onClick={run.disableDetailsPopup ? undefined : toggle}
          onKeyDown={
            run.disableDetailsPopup
              ? undefined
              : (keyEvent) => {
                  if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
                    keyEvent.preventDefault();
                    toggle();
                  }
                }
          }
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
    },
  ),
);

export default RunDisplay;
