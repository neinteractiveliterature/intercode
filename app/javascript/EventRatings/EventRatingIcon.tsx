import React from 'react';
import classnames from 'classnames';

export const RATING_NAMES = {
  1: 'Favorite',
  0: 'TBD',
  '-1': 'Hidden',
};

function getRatingIconClass(rating: number, selected?: boolean) {
  if (rating === -1) {
    return 'fa-eye-slash';
  }

  if (rating === 1) {
    return selected ? 'fa-star' : 'fa-star-o';
  }

  return '';
}

function getRatingColorClass(rating: number, selected?: boolean) {
  if (rating === -1) {
    return selected ? 'text-danger' : 'text-secondary text-hover-danger';
  }

  if (rating === 1) {
    return selected ? 'text-warning' : 'text-secondary text-hover-warning';
  }

  return '';
}

export type EventRatingIconProps = {
  rating: number,
  selected?: boolean,
  useColors?: boolean,
  size?: number,
  overrideElementSize?: boolean
};

function EventRatingIcon({
  rating, selected, useColors, size, overrideElementSize,
}: EventRatingIconProps) {
  const effectiveSize = size ?? 1.0;

  return (
    <i
      className={classnames(
        'fa',
        getRatingIconClass(rating, selected),
        useColors ? getRatingColorClass(rating, selected) : null,
      )}
      style={{
        fontSize: `${effectiveSize}rem`,
        width: overrideElementSize ? `${effectiveSize}rem` : undefined,
        height: overrideElementSize ? `${effectiveSize}rem` : undefined,
      }}
    >
      <span className="sr-only">{RATING_NAMES[rating]}</span>
    </i>
  );
}

export default EventRatingIcon;
