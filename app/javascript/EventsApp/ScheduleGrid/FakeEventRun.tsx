import { ReactNode } from 'react';
import * as React from 'react';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import {
  GetEventCategoryStylesOptions,
  getRunClassificationStyles,
  getRunClassName,
  SignupStatus,
} from './StylingUtils';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';
import Timespan from '../../Timespan';

export type FakeEventRunProps = {
  classifyEventsBy?: 'category' | 'fullness';
  eventCategory?: GetEventCategoryStylesOptions['eventCategory'];
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
  classifyEventsBy,
}: FakeEventRunProps): JSX.Element {
  const config = {
    classifyEventsBy: classifyEventsBy ?? ('category' as const),
    showSignedUp: true,
  };
  const signupCount = Math.round((1.0 - (availability ?? 0)) * 100);
  const signupCountData = {
    runFull: () => runFull ?? false,
    getConfirmedLimitedSignupCount: () => signupCount,
    getNotCountedConfirmedSignupCount: () => signupCount,
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
              slots_limited: !unlimited,
              total_slots: zeroCapacity ? 0 : 100,
              preferred_slots: zeroCapacity ? 0 : 60,
              minimum_slots: zeroCapacity ? 0 : 30,
              total_slots_including_not_counted: zeroCapacity ? 0 : 100,
              preferred_slots_including_not_counted: zeroCapacity ? 0 : 60,
              minimum_slots_including_not_counted: zeroCapacity ? 0 : 30,
            },
          },
          unlimited: unlimited ?? false,
          runDimensions: {
            fullTimespan: Timespan.finiteFromStrings(
              '1970-01-01T00:00:00Z',
              '1970-01-01T00:00:00Z',
            ),
            timespan: Timespan.finiteFromStrings('1970-01-01T00:00:00Z', '1970-01-01T00:00:00Z'),
            laneIndex: 0,
            runId: 0,
            timeAxisSizePercent: 100,
            timeAxisStartPercent: 0,
          },
        }),
      )}
      style={runStyle}
      ref={withRef}
      {...clickableProps}
    >
      <div className="schedule-grid-event-content">
        <div className="schedule-grid-event-content-main">{children}</div>
      </div>

      <AvailabilityBar
        availabilityFraction={availability ?? 0.0}
        unlimited={unlimited}
        runStyle={runStyle}
      />
    </div>
  );
}

export default FakeEventRun;
