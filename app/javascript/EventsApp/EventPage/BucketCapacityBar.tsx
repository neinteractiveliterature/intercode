import React from 'react';

function mapRange<T>(start: number, end: number, step: number, closure: (index: number) => T) {
  const result: T[] = [];
  for (let index = start; index < end; index += step) {
    result.push(closure(index));
  }
  return result;
}

export type BucketCapacityBarProps = {
  startingTickmarkIndex?: number,
  tickmarkCount: number,
  tickmarkClass?: string,
  className?: string,
  widthFraction: number,
};

function BucketCapacityBar({
  startingTickmarkIndex, tickmarkCount, tickmarkClass, className, widthFraction,
}: BucketCapacityBarProps) {
  return (
    <div
      className={`bucket-capacity-bar ${className}`}
      style={{ width: `${widthFraction * 100.0}%` }}
    >
      {mapRange(startingTickmarkIndex ?? 0, tickmarkCount, 1, (index) => (
        <div
          key={index}
          className={`bucket-capacity-tickmark bg-white ${tickmarkClass}`}
          style={{
            left: `${(index / tickmarkCount) * 100.0}%`,
          }}
        />
      ))}
    </div>
  );
}

export default BucketCapacityBar;
