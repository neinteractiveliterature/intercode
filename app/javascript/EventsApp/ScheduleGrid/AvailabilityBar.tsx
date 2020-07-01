import React from 'react';
import classNames from 'classnames';

export type AvailabilityBarProps = {
  availabilityFraction: number,
  unlimited?: boolean,
  runStyle: any,
};

function AvailabilityBar({ availabilityFraction, unlimited, runStyle }: AvailabilityBarProps) {
  const unavailableBarWidth = (
    unlimited
      ? 100.0
      : 100.0 - (availabilityFraction * 100.0)
  );

  return (
    <div className={classNames('availability-bar', { unlimited })}>
      <div
        className="available"
        style={{
          boxShadow: unavailableBarWidth < 100.0
            ? `inset 0 0 2px 2px ${(runStyle ?? {}).backgroundColor ?? 'transparent'}`
            : undefined,
        }}
      />
      <div
        style={{
          width: `${unavailableBarWidth}%`,
          backgroundColor: (runStyle ?? {}).backgroundColor,
        }}
        className="unavailable"
      />
    </div>
  );
}

export default AvailabilityBar;
