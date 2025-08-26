import classnames from 'classnames';

export const RATING_NAMES = {
  '1': 'Favorite',
  '0': 'TBD',
  '-1': 'Hidden',
};

function isRating(ratingKey: string): ratingKey is keyof typeof RATING_NAMES {
  return ratingKey in RATING_NAMES;
}

function getRatingIconClass(rating: number, selected?: boolean) {
  if (rating === -1) {
    return 'bi-eye-slash';
  }

  if (rating === 1) {
    return selected ? 'bi-star-fill' : 'bi-star';
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
  rating: number;
  size?: number;
  selected?: boolean;
  useColors?: boolean;
  overrideElementSize?: boolean;
};

function EventRatingIcon({
  rating,
  selected,
  useColors,
  size: providedSize,
  overrideElementSize,
}: EventRatingIconProps): React.JSX.Element {
  const size = providedSize ?? 1.0;
  const ratingKey = `${rating}`;

  return (
    <i
      className={classnames(
        getRatingIconClass(rating, selected),
        useColors ? getRatingColorClass(rating, selected) : null,
      )}
      style={{
        fontSize: `${size}rem`,
        width: overrideElementSize ? `${size}rem` : undefined,
        height: overrideElementSize ? `${size}rem` : undefined,
      }}
    >
      <span className="visually-hidden">{isRating(ratingKey) && RATING_NAMES[ratingKey]}</span>
    </i>
  );
}

export default EventRatingIcon;
