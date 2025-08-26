import { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from 'styles/schedule_grid.module.scss';

export type AvailabilityBarProps = {
  availabilityFraction: number;
  unlimited?: boolean;
  runStyle?: CSSProperties;
};

function AvailabilityBar({ availabilityFraction, unlimited, runStyle }: AvailabilityBarProps): React.JSX.Element {
  const unavailableBarWidth = unlimited ? 100.0 : 100.0 - availabilityFraction * 100.0;

  return (
    <div className={classNames('availability-bar', styles.availabilityBar, { unlimited })}>
      <div
        className={`available ${styles.available}`}
        style={{
          boxShadow:
            unavailableBarWidth < 100.0
              ? `inset 0 0 2px 2px ${(runStyle || {}).backgroundColor || 'transparent'}`
              : undefined,
        }}
      />
      <div
        style={{
          width: `${unavailableBarWidth}%`,
          backgroundColor: (runStyle || {}).backgroundColor,
        }}
        className={`unavailable ${styles.unavailable}`}
      />
    </div>
  );
}

export default AvailabilityBar;
