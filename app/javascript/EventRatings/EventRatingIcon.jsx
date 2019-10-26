import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const RATING_NAMES = {
  1: 'Favorite',
  0: 'TBD',
  '-1': 'Hidden',
};

export function getRatingIconClass(rating, selected) {
  if (rating === -1) {
    return 'fa-eye-slash';
  }

  if (rating === 1) {
    return selected ? 'fa-star' : 'fa-star-o';
  }

  return '';
}

export function getRatingColorClass(rating, selected) {
  if (rating === -1) {
    return selected ? 'text-danger' : 'text-secondary text-hover-danger';
  }

  if (rating === 1) {
    return selected ? 'text-warning' : 'text-secondary text-hover-warning';
  }

  return '';
}

function EventRatingIcon({ rating, selected, size }) {
  return (
    <i
      className={classnames(
        'fa',
        getRatingIconClass(rating, selected),
        getRatingColorClass(rating, selected),
      )}
      style={{
        fontSize: `${size}rem`,
        width: `${size * 2.0}rem`,
        height: `${size * 2.0}rem`,
        paddingTop: `${size * 0.5}rem`,
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
};

EventRatingIcon.defaultProps = {
  selected: false,
  size: 1.0,
};

export default EventRatingIcon;
