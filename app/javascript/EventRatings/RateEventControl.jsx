import React from 'react';
import PropTypes from 'prop-types';

import EventRatingIcon from './EventRatingIcon';

function RatingPicker({ onClickRating }) {
  return (
    <div className="d-flex">
      {[1, -1].map((rating) => (
        <button
          key={rating}
          type="button"
          className="btn p-0 cursor-pointer border-0"
          onClick={() => onClickRating(rating)}
        >
          <EventRatingIcon rating={rating} />
        </button>
      ))}
    </div>
  );
}

RatingPicker.propTypes = {
  onClickRating: PropTypes.func.isRequired,
};

function RateEventControl({ value, onChange }) {
  const clearRating = () => {
    onChange(0);
  };

  const hasRating = value != null && value !== 0;
  const width = `${hasRating ? 3 : 6}rem`;

  return (
    <div className="bg-white border rounded rate-event-control" style={{ width }}>
      {hasRating
        ? (
          <button type="button" className="btn p-0 cursor-pointer border-0" onClick={clearRating}>
            <EventRatingIcon rating={value} selected />
          </button>
        )
        : <RatingPicker onClickRating={onChange} />}
    </div>
  );
}

RateEventControl.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

RateEventControl.defaultProps = {
  value: null,
};

export default RateEventControl;
