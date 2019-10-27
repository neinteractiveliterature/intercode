import React from 'react';
import PropTypes from 'prop-types';

import EventRatingIcon from './EventRatingIcon';

function RatingButton({
  rating, selected, onClick, padding, size,
}) {
  const defaultPadding = size * 0.5;
  const actualPadding = (padding || defaultPadding);
  const paddingStyle = {
    padding: `${actualPadding}rem`,
    paddingTop: `${actualPadding * 0.75}rem`,
    paddingBottom: `${actualPadding * 0.75}rem`,
  };

  return (
    <button
      key={rating}
      type="button"
      className="btn p-0 cursor-pointer border-0"
      onClick={onClick}
    >
      <div style={paddingStyle}>
        <EventRatingIcon
          size={size}
          rating={rating}
          selected={selected}
          useColors
          overrideElementSize
        />
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
  padding: null,
};

function RateEventControl({ value, onChange, size }) {
  const clearRating = () => {
    onChange(0);
  };

  const hasRating = value != null && value !== 0;
  const buttonSize = size || RatingButton.defaultProps.size;
  const buttonPadding = buttonSize * 0.5;
  const buttonWidth = buttonSize + (buttonPadding * 2.0);
  const width = `calc(${hasRating ? buttonWidth : buttonWidth * 2.0}rem + 2px)`;

  return (
    <div className="bg-white border rounded rate-event-control" style={{ width }}>
      {hasRating
        ? (
          <RatingButton
            rating={value}
            onClick={clearRating}
            selected
            size={size}
          />
        )
        : (
          <div className="d-flex">
            {[1, -1].map((rating) => (
              <RatingButton
                key={rating}
                rating={rating}
                onClick={() => onChange(rating)}
                size={size}
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
  size: PropTypes.number,
};

RateEventControl.defaultProps = {
  value: null,
  size: 1.0,
};

export default RateEventControl;
