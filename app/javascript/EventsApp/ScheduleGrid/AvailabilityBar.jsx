import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function AvailabilityBar({ availabilityFraction, unlimited, runStyle }) {
  const unavailableBarWidth = (
    unlimited
      ? 100.0
      : 100.0 - (availabilityFraction * 100.0)
  );

  return (
    <div className={classNames('availability-bar', { unlimited })}>
      <div
        className="available"
        style={{
          boxShadow: unavailableBarWidth < 100.0
            ? `inset 0 0 2px 2px ${(runStyle || {}).backgroundColor || 'transparent'}`
            : null,
        }}
      />
      <div
        style={{
          width: `${unavailableBarWidth}%`,
          backgroundColor: (runStyle || {}).backgroundColor,
        }}
        className="unavailable"
      />
    </div>
  );
}

AvailabilityBar.propTypes = {
  availabilityFraction: PropTypes.number.isRequired,
  unlimited: PropTypes.bool,
  runStyle: PropTypes.shape({}),
};

AvailabilityBar.defaultProps = {
  runStyle: null,
  unlimited: false,
};

export default AvailabilityBar;
