import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const RATING_NAMES = {
  1: 'Favorite',
  0: 'TBD',
  '-1': 'Hidden',
};

function getRatingIconClass(rating, selected) {
  if (rating === -1) {
    return 'fa-eye-slash';
  }

  if (rating === 1) {
    return selected ? 'fa-star' : 'fa-star-o';
  }

  return '';
}

function getRatingColorClass(rating, selected) {
  if (rating === -1) {
    return selected ? 'text-danger' : 'text-secondary text-hover-danger';
  }

  if (rating === 1) {
    return selected ? 'text-warning' : 'text-secondary text-hover-warning';
  }

  return '';
}

function EventRatingIcon({
  rating, selected, useColors, size, overrideElementSize,
}) {
  return (
    <i
      className={classnames(
        'fa',
        getRatingIconClass(rating, selected),
        useColors ? getRatingColorClass(rating, selected) : null,
      )}
      style={{
        fontSize: `${size}rem`,
        width: overrideElementSize ? `${size}rem` : null,
        height: overrideElementSize ? `${size}rem` : null,
      }}
    >
      <span className="sr-only">{RATING_NAMES[rating]}</span>
    </i>
  );
}

EventRatingIcon.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.number,
  selected: PropTypes.bool,
  useColors: PropTypes.bool,
  overrideElementSize: PropTypes.bool,
};

EventRatingIcon.defaultProps = {
  selected: false,
  useColors: false,
  size: 1.0,
  overrideElementSize: false,
};

export default EventRatingIcon;
