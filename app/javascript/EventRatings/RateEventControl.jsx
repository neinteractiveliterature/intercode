import React from 'react';
import PropTypes from 'prop-types';

import EventRatingIcon from './EventRatingIcon';

function RatingButton({
  rating, selected, onClick, padding, size,
}) {
  return (
    <button
      key={rating}
      type="button"
      className="btn p-0 cursor-pointer border-0"
      onClick={onClick}
    >
      <div style={{ padding: `${padding}rem` }}>
        <EventRatingIcon size={size} rating={rating} selected={selected} />
      </div>
    </button>
  );
}

RatingButton.propTypes = {
  rating: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  size: PropTypes.number,
  padding: PropTypes.number,
};

RatingButton.defaultProps = {
  selected: false,
  size: 1.0,
  padding: 0.0,
};

function RateEventControl({ value, onChange, buttonProps }) {
  const clearRating = () => {
    onChange(0);
  };

  const hasRating = value != null && value !== 0;
  const buttonSize = (buttonProps || {}).size || RatingButton.defaultProps.size;
  const buttonPadding = (buttonProps || {}).padding || RatingButton.defaultProps.padding;
  const buttonWidth = (buttonSize * 2.0) + (buttonPadding * 2.0);
  const width = `calc(${hasRating ? buttonWidth : buttonWidth * 2.0}rem + 2px)`;

  return (
    <div className="bg-white border rounded rate-event-control" style={{ width }}>
      {hasRating
        ? (
          <RatingButton
            rating={value}
            onClick={clearRating}
            selected
            {...buttonProps}
          />
        )
        : (
          <div className="d-flex">
            {[1, -1].map((rating) => (
              <RatingButton
                key={rating}
                rating={rating}
                onClick={() => onChange(rating)}
                {...buttonProps}
              />
            ))}
          </div>
        )}
    </div>
  );
}

RateEventControl.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  buttonProps: PropTypes.shape({}),
};

RateEventControl.defaultProps = {
  value: null,
  buttonProps: {},
};

export default RateEventControl;
