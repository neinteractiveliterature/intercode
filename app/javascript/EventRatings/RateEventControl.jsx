import React from 'react';
import PropTypes from 'prop-types';

import EventRatingIcon from './EventRatingIcon';
import ButtonWithTooltip from '../UIComponents/ButtonWithTooltip';

function RatingButton({
  rating, selected, onClick, padding, size, tooltipContent,
}) {
  const defaultPadding = size * 0.5;
  const actualPadding = (padding || defaultPadding);
  const paddingStyle = {
    padding: `${actualPadding}rem`,
    paddingTop: `${actualPadding * 0.75}rem`,
    paddingBottom: `${actualPadding * 0.75}rem`,
  };

  return (
    <ButtonWithTooltip
      buttonProps={{
        type: 'button',
        className: 'btn p-0 cursor-pointer border-0',
        onClick,
      }}
      tooltipContent={tooltipContent}
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
    </ButtonWithTooltip>
  );
}

RatingButton.propTypes = {
  rating: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltipContent: PropTypes.string.isRequired,
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
            tooltipContent="Clear rating"
          />
        )
        : (
          <div className="d-flex">
            <RatingButton
              rating={1}
              onClick={() => onChange(1)}
              size={size}
              tooltipContent="Mark as favorite"
            />

            <RatingButton
              rating={-1}
              onClick={() => onChange(1)}
              size={size}
              tooltipContent="Hide event"
            />
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
