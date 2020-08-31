import React, { ReactNode } from 'react';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import { getRunClassificationStyles, getRunClassName, SignupStatus } from './StylingUtils';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';

export type FakeEventRunProps = {
  eventCategory: {};
  children: ReactNode;
  availability?: number;
  unlimited?: boolean;
  runFull?: boolean;
  signupStatus?: SignupStatus;
  onClick?: () => void;
  withRef?: React.Ref<HTMLDivElement>;
  zeroCapacity?: boolean;
};

function FakeEventRun({
  eventCategory,
  children,
  availability,
  unlimited,
  runFull,
  signupStatus,
  onClick,
  withRef,
  zeroCapacity,
}: FakeEventRunProps) {
  const config = { classifyEventsBy: 'category' as const, showSignedUp: true };
  const signupCountData = {
    runFull: () => runFull ?? false,
    getConfirmedLimitedSignupCount: () => 0,
    getNotCountedConfirmedSignupCount: () => 0,
  };
  const clickableProps = onClick
    ? {
        tabIndex: 0,
        role: 'button',
        onClick,
      }
    : {};

  const runStyle = {
    zIndex: 0,
    position: 'relative' as const,
    height: PIXELS_PER_LANE - LANE_GUTTER_HEIGHT,
    marginBottom: LANE_GUTTER_HEIGHT,
    ...getRunClassificationStyles({
      config,
      signupCountData,
      signupStatus,
      event: {},
      eventCategory: eventCategory || {},
    }),
  };

  return (
    <div
      className={classNames(
        'px-1 pb-1 schedule-grid-event small',
        getRunClassName({
          config,
          signupCountData,
          signupStatus,
          event: {
            registration_policy: {
              buckets: [],
              total_slots_including_not_counted: 0,
            },
          },
          unlimited: unlimited ?? false,
        }),
        {
          'zero-capacity': zeroCapacity,
        },
      )}
      style={runStyle}
      ref={withRef}
      {...clickableProps}
    >
      <div className="schedule-grid-event-content">{children}</div>

      <AvailabilityBar
        availabilityFraction={availability ?? 0.0}
        unlimited={unlimited}
        runStyle={runStyle}
      />
    </div>
  );
}

export default FakeEventRun;
