import React from 'react';

import EventRatingIcon from './EventRatingIcon';
import ButtonWithTooltip from '../UIComponents/ButtonWithTooltip';

type RatingButtonProps = {
  rating: number,
  onClick: () => any,
  tooltipContent: string,
  padding?: number,
  selected?: boolean,
  size?: number,
};

function RatingButton({
  rating, selected, onClick, padding, size, tooltipContent,
}: RatingButtonProps) {
  const defaultPadding = (size ?? 1.0) * 0.5;
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

export type RateEventControlProps = {
  value?: number | null,
  onChange: (rating: number) => any,
  size?: number,
};

function RateEventControl({ value, onChange, size }: RateEventControlProps) {
  const clearRating = () => {
    onChange(0);
  };

  const hasRating = value != null && value !== 0;
  const buttonSize = size ?? 1.0;
  const buttonPadding = buttonSize * 0.5;
  const buttonWidth = buttonSize + (buttonPadding * 2.0);
  const width = `calc(${hasRating ? buttonWidth : buttonWidth * 2.0}rem + 2px)`;

  return (
    <div className="bg-white border rounded rate-event-control" style={{ width }}>
      {hasRating
        ? (
          <RatingButton
            rating={value ?? 0}
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
              onClick={() => onChange(-1)}
              size={size}
              tooltipContent="Hide event"
            />
          </div>
        )}
    </div>
  );
}

export default RateEventControl;
