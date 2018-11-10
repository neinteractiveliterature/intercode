import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function AvailabilityBar({ availabilityFraction, unlimited }) {
  const unavailableBarWidth = (
    unlimited
      ? 100.0
      : 100.0 - (availabilityFraction * 100.0)
  );

  return (
    <div className={classNames('availability-bar', { unlimited })}>
      <div style={{ width: `${unavailableBarWidth}%` }} className="unavailable" />
    </div>
  );
}

AvailabilityBar.propTypes = {
  availabilityFraction: PropTypes.number.isRequired,
  unlimited: PropTypes.bool,
};

AvailabilityBar.defaultProps = {
  unlimited: false,
};

export default AvailabilityBar;
