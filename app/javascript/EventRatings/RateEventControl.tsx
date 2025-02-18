import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithTooltip } from '@neinteractiveliterature/litform';
import styles from 'styles/event_ratings.module.scss';

import EventRatingIcon from './EventRatingIcon';

type RatingButtonProps = {
  rating: number;
  onClick: () => void;
  tooltipContent: ReactNode;
  selected?: boolean;
  size?: number;
  padding?: number;
};

function RatingButton({ rating, selected, onClick, padding, size, tooltipContent }: RatingButtonProps) {
  const defaultPadding = (size ?? 1.0) * 0.5;
  const actualPadding = padding ?? defaultPadding;
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
        <EventRatingIcon size={size} rating={rating} selected={selected} useColors overrideElementSize />
      </div>
    </ButtonWithTooltip>
  );
}

export type RateEventControlProps = {
  value?: number | null;
  onChange: (newValue: number) => void;
  size?: number;
};

function RateEventControl({ value, onChange, size }: RateEventControlProps): JSX.Element {
  const { t } = useTranslation();
  const clearRating = () => {
    onChange(0);
  };

  const hasRating = value != null && value !== 0;
  const buttonSize = size ?? 1.0;
  const buttonPadding = buttonSize * 0.5;
  const buttonWidth = buttonSize + buttonPadding * 2.0;
  const width = `calc(${hasRating ? buttonWidth : buttonWidth * 2.0}rem + 2px)`;

  return (
    <div className={`bg-white border rounded rate-event-control ${styles.rateEventControl}`} style={{ width }}>
      {hasRating && value != null ? (
        <RatingButton
          rating={value}
          onClick={clearRating}
          selected
          size={size}
          tooltipContent={t('events.ratings.clearButton')}
        />
      ) : (
        <div className="d-flex">
          <RatingButton
            rating={1}
            onClick={() => onChange(1)}
            size={size}
            tooltipContent={t('events.ratings.favoriteButton')}
          />

          <RatingButton
            rating={-1}
            onClick={() => onChange(-1)}
            size={size}
            tooltipContent={t('events.ratings.hideButton')}
          />
        </div>
      )}
    </div>
  );
}

export default RateEventControl;
