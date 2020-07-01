/* eslint-disable react/no-array-index-key */

import React, {
  useState, useCallback, useMemo, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { ResizeObserver } from '@juggle/resize-observer';

export type BucketAvailabilityDisplayProps = {
  signupCount: number,
  remainingCapacity: number,
  className?: string,
  compact?: boolean,
};

function BucketAvailabilityDisplay({
  className, signupCount, remainingCapacity, compact,
}: BucketAvailabilityDisplayProps) {
  const totalCells = signupCount + remainingCapacity;
  const [containerWidth, setContainerWidth] = useState(300);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const measuredRef = useCallback((element) => {
    if (element !== null) {
      setContainerWidth(element.getBoundingClientRect().width);

      if (resizeObserverRef.current) {
        // element changed under us, just disconnect and reconnect
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current.observe(element);
      } else {
        resizeObserverRef.current = new ResizeObserver((entries) => {
          window.requestAnimationFrame(() => {
            setContainerWidth(entries[0].contentBoxSize[0].inlineSize);
          });
        });
        resizeObserverRef.current.observe(element);
      }
    }
  }, []);

  useEffect(
    () => () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    },
    [],
  );

  const cellWidth = useMemo(
    () => {
      const cellWidthRem = compact ? 0.6 : 1.05;
      const remWidth = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return (cellWidthRem * remWidth) + 2; // 2px margins
    },
    [compact],
  );

  const maxCellsPerLine = useMemo(
    () => Math.floor(containerWidth / cellWidth),
    [cellWidth, containerWidth],
  );
  let lineWidth = totalCells;
  let numLines = 1;
  if (lineWidth > maxCellsPerLine) {
    numLines = Math.floor(lineWidth / maxCellsPerLine) + 1;
    lineWidth = Math.ceil(totalCells / numLines);
  }

  const generateNElements = (n, generateElement) => {
    if (n < 1) {
      return [];
    }

    return [...Array(n)].map(generateElement);
  };

  const cells = [
    ...generateNElements(signupCount, (value, index) => (
      <div className="bucket-availability-cell" key={`signedup-${index}`}>
        <i className="fa fa-user-circle-o" />
      </div>
    )),
    ...generateNElements(remainingCapacity, (value, index) => (
      <div className="bucket-availability-cell" key={`available-${index}`}>
        <i className="fa fa-circle-thin" />
      </div>
    )),
  ];

  if (maxCellsPerLine < 1) {
    return <div ref={measuredRef} />;
  }

  return (
    <div ref={measuredRef}>
      {[...Array(numLines)].map((value, index) => (
        <div
          className={classNames('bucket-availability-display', className, { 'bucket-availability-display-compact': compact })}
          key={`line-${index}`}
        >
          {cells.slice(index * lineWidth, (index + 1) * lineWidth)}
        </div>
      ))}
    </div>
  );
}

export default BucketAvailabilityDisplay;
