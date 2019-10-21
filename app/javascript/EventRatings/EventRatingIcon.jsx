import React from 'react';
import PropTypes from 'prop-types';

const RATING_NAMES = {
  1: 'interested',
  0: 'TBD',
  '-1': 'not interested',
};

const RATING_ICON_CLASSES = {
  1: 'fa-smile-o',
  0: 'fa-meh-o',
  '-1': 'fa-frown-o',
};

function EventRatingIcon({ rating }) {
  return (
    <i className={`fa ${RATING_ICON_CLASSES[rating]} m-2`}>
      <span className="sr-only">{RATING_NAMES[rating]}</span>
    </i>
  );
}

EventRatingIcon.propTypes = {
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EventRatingIcon;
