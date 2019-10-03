import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import { getRunClassificationStyles, getRunClassName } from './StylingUtils';
import { PIXELS_PER_LANE, LANE_GUTTER_HEIGHT } from './LayoutConstants';

function FakeEventRun({
  eventCategory, children, availability, unlimited, runFull, signupStatus, onClick, withRef,
  zeroCapacity,
}) {
  const config = { classifyEventsBy: 'category', showSignedUp: true };
  const signupCountData = { runFull: () => runFull };
  const clickableProps = (
    onClick
      ? {
        tabIndex: 0,
        role: 'button',
        onClick,
      }
      : {}
  );

  const runStyle = {
    zIndex: 0,
    position: 'relative',
    height: PIXELS_PER_LANE - LANE_GUTTER_HEIGHT,
    marginBottom: LANE_GUTTER_HEIGHT,
    ...getRunClassificationStyles({
      config, signupCountData, signupStatus, event: {}, eventCategory: (eventCategory || {}),
    }),
    'zero-capacity': zeroCapacity,
  };

  return (
    <div
      className={classNames(
        'px-1 pb-1 schedule-grid-event small',
        getRunClassName({
          config, signupCountData, signupStatus, event: {}, unlimited,
        }),
      )}
      style={runStyle}
      ref={withRef}
      {...clickableProps}
    >
      <div className="schedule-grid-event-content">
        {children}
      </div>

      <AvailabilityBar
        availabilityFraction={availability}
        unlimited={unlimited}
        runStyle={runStyle}
      />
    </div>
  );
}

FakeEventRun.propTypes = {
  eventCategory: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
  availability: PropTypes.number,
  unlimited: PropTypes.bool,
  runFull: PropTypes.bool,
  signupStatus: PropTypes.string,
  onClick: PropTypes.func,
  withRef: PropTypes.func,
  zeroCapacity: PropTypes.bool,
};

FakeEventRun.defaultProps = {
  availability: 0.0,
  unlimited: false,
  runFull: false,
  signupStatus: null,
  onClick: undefined,
  withRef: undefined,
  zeroCapacity: false,
};

export default FakeEventRun;
