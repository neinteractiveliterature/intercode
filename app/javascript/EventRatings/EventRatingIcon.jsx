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
    return selected ? 'text-danger' : 'text-hover-danger';
  }

  if (rating === 1) {
    return selected ? 'text-warning' : 'text-hover-warning';
  }

  return '';
}

function EventRatingIcon({ rating, selected }) {
  return (
    <i
      className={classnames(
        'event-rating-icon fa',
        getRatingIconClass(rating, selected),
        getRatingColorClass(rating, selected),
      )}
      style={{ fontSize: '1.5rem' }}
    >
      <span className="sr-only">{RATING_NAMES[rating]}</span>
    </i>
  );
}

EventRatingIcon.propTypes = {
  rating: PropTypes.number.isRequired,
  selected: PropTypes.bool,
};

EventRatingIcon.defaultProps = {
  selected: false,
};

export default EventRatingIcon;
