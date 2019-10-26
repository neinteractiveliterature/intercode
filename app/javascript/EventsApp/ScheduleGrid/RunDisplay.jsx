import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ScheduleGridContext } from './ScheduleGridContext';
import { userSignupStatus, getRunStyle, getRunClassName } from './StylingUtils';
import { calculateAvailability } from './AvailabilityUtils';
import AvailabilityBar from './AvailabilityBar';
import SignupStatusBadge from './SignupStatusBadge';
import { RegistrationPolicyPropType } from '../../RegistrationPolicy/RegistrationPolicy';

const RunDisplay = React.memo(React.forwardRef(({
  event, run, signupCountData, toggle, runDimensions, layoutResult,
}, ref) => {
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
  });

  const { availabilityFraction, unlimited } = calculateAvailability(event, signupCountData);

  const renderAvailabilityBar = () => {
    if (
      event.registration_policy.slots_limited
      && event.registration_policy.total_slots_including_not_counted === 0
    ) {
      return null;
    }

    return (
      <AvailabilityBar
        availabilityFraction={availabilityFraction}
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
          {signupCountData.sumSignupCounts({ state: 'confirmed', counted: true })}
        </span>
        /
        <span className="text-info">
          {signupCountData.sumSignupCounts({ state: 'confirmed', counted: false })}
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
      role="button"
      onClick={toggle}
      onKeyDown={(keyEvent) => {
        if (keyEvent.keyCode === 13 || keyEvent.keyCode === 32) {
          keyEvent.preventDefault();
          toggle();
        }
      }}
      ref={ref}
    >
      {renderExtendedCounts(config, signupCountData)}
      <div className="schedule-grid-event-content">
        {renderAvailabilityBar(signupCountData)}
        {renderSignupStatusBadge()}
        {event.title}
      </div>
    </div>
  );
}));

RunDisplay.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    registration_policy: RegistrationPolicyPropType.isRequired,
    event_category: PropTypes.shape({}).isRequired,
  }).isRequired,
  run: PropTypes.shape({}).isRequired,
  signupCountData: PropTypes.shape({
    sumSignupCounts: PropTypes.func.isRequired,
    getWaitlistCount: PropTypes.func.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  runDimensions: PropTypes.shape({}).isRequired,
  layoutResult: PropTypes.shape({}).isRequired,
};

export default RunDisplay;
