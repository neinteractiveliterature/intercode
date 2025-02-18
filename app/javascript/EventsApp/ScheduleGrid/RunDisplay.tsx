import { memo, forwardRef } from 'react';

import { userSignupStatus, getRunStyle, getRunClassName } from './StylingUtils';
import { calculateAvailability } from './AvailabilityUtils';
import AvailabilityBar from './AvailabilityBar';
import SignupStatusBadge from './SignupStatusBadge';
import { ScheduleEvent, ScheduleRun } from './Schedule';
import SignupCountData from '../SignupCountData';
import { ScheduleLayoutResult, RunDimensions } from './ScheduleLayout/ScheduleLayoutBlock';
import { SignupState } from '../../graphqlTypes.generated';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { ScheduleGridConfig } from './ScheduleGridConfig';
import styles from 'styles/schedule_grid.module.scss';

export type RunDisplayProps = {
  event: ScheduleEvent;
  run: ScheduleRun;
  signupCountData: SignupCountData;
  toggle: () => void;
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
  showSignupStatusBadge: boolean;
  showExtendedCounts: boolean;
  classifyEventsBy: ScheduleGridConfig['classifyEventsBy'];
  showSignedUp: ScheduleGridConfig['showSignedUp'];
};

const RunDisplay = forwardRef<HTMLDivElement, RunDisplayProps>(function RunDisplay(
  {
    event,
    run,
    signupCountData,
    toggle,
    runDimensions,
    layoutResult,
    showSignupStatusBadge,
    classifyEventsBy,
    showSignedUp,
    showExtendedCounts,
  },
  ref,
) {
  const signupStatus = userSignupStatus(run);
  const format = useAppDateTimeFormat();

  const runStyle = getRunStyle({
    event,
    eventCategory: event.event_category,
    signupStatus,
    config: { classifyEventsBy },
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
      <AvailabilityBar availabilityFraction={availabilityFraction} unlimited={unlimited ?? false} runStyle={runStyle} />
    );
  };

  const renderExtendedCounts = () => {
    if (!showExtendedCounts) {
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
    if (!showSignupStatusBadge) {
      return null;
    }

    return (
      <SignupStatusBadge
        signupStatus={signupStatus}
        myRating={event.my_rating ?? undefined}
        mySignupRankedChoices={run.my_signup_ranked_choices}
      />
    );
  };

  return (
    <div
      tabIndex={run.disableDetailsPopup ? undefined : 0}
      className={getRunClassName({
        event,
        signupStatus: signupStatus ?? undefined,
        config: { classifyEventsBy, showSignedUp },
        signupCountData,
        unlimited: unlimited ?? false,
        runDimensions,
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
      <div className={`schedule-grid-event-content ${styles.scheduleGridEventContent}`}>
        {!event.fake && renderAvailabilityBar()}
        {runDimensions.fullTimespan.start < runDimensions.timespan.start && (
          <div
            className={`schedule-grid-event-truncation-label truncation-label-start ${styles.scheduleGridEventTruncationLabel}`}
          >
            starts {format(runDimensions.fullTimespan.start, 'shortWeekdayTime')}
          </div>
        )}
        <div className={`schedule-grid-event-content-main ${styles.scheduleGridEventContentMain}`}>
          {renderSignupStatusBadge()}
          {event.displayTitle || event.title}
        </div>
        {runDimensions.fullTimespan.finish > runDimensions.timespan.finish && (
          <div
            className={`schedule-grid-event-truncation-label truncation-label-finish ${styles.scheduleGridEventTruncationLabel}`}
          >
            ends {format(runDimensions.fullTimespan.finish, 'shortWeekdayTime')}
          </div>
        )}
      </div>
    </div>
  );
});

export default memo(RunDisplay);
