import React from 'react';
import PropTypes from 'prop-types';

function mapRange(start, end, step, closure) {
  const result = [];
  for (let index = start; index < end; index += step) {
    result.push(closure(index));
  }
  return result;
}

function BucketCapacityBar({
  startingTickmarkIndex, tickmarkCount, tickmarkClass, className, widthFraction,
}) {
  return (
    <div
      className={`bucket-capacity-bar ${className}`}
      style={{ width: `${widthFraction * 100.0}%` }}
    >
      {mapRange(startingTickmarkIndex, tickmarkCount, 1, index => (
        <div
          key={index}
          className={`bucket-capacity-tickmark bg-white ${tickmarkClass}`}
          style={{
            left: `${(index / tickmarkCount) * 100.0}%`,
          }}
        />
      ))}
    </div>
  );
}

BucketCapacityBar.propTypes = {
  className: PropTypes.string,
  widthFraction: PropTypes.number.isRequired,
  tickmarkCount: PropTypes.number.isRequired,
  tickmarkClass: PropTypes.string,
  startingTickmarkIndex: PropTypes.number,
};

BucketCapacityBar.defaultProps = {
  className: '',
  tickmarkClass: '',
  startingTickmarkIndex: 0,
};

export default BucketCapacityBar;
