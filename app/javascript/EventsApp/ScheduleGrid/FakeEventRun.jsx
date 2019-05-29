import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import { getRunClassificationStyles, getRunClassName } from './StylingUtils';

function FakeEventRun({
  eventCategory, children, availability, unlimited, runFull, signupStatus, onClick, withRef,
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

  return (
    <div
      className={classNames(
        'px-1 pb-1 schedule-grid-event small',
        getRunClassName({
          config, signupCountData, signupStatus, event: {},
        }),
      )}
      style={{
        zIndex: 0,
        position: 'relative',
        ...getRunClassificationStyles({
          config, signupCountData, signupStatus, event: {}, eventCategory: (eventCategory || {}),
        }),
      }}
      ref={withRef}
      {...clickableProps}
    >
      {children}

      <AvailabilityBar availabilityFraction={availability} unlimited={unlimited} />
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
};

FakeEventRun.defaultProps = {
  availability: 0.0,
  unlimited: false,
  runFull: false,
  signupStatus: null,
  onClick: undefined,
  withRef: undefined,
};

export default FakeEventRun;
