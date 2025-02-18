import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ResizeObserver } from '@juggle/resize-observer';
import styles from 'styles/bucket_availability_display.module.scss';

export type BucketAvailabilityDisplayProps = {
  className?: string;
  signupCount: number;
  remainingCapacity: number;
  compact?: boolean;
};

function BucketAvailabilityDisplay({
  className,
  signupCount,
  remainingCapacity,
  compact,
}: BucketAvailabilityDisplayProps): JSX.Element {
  const totalCells = signupCount + remainingCapacity;
  const [containerWidth, setContainerWidth] = useState(300);
  const resizeObserverRef = useRef<ResizeObserver>();

  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const measuredRef = useCallback((element: HTMLDivElement) => {
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

  const cellWidth = useMemo(() => {
    const cellWidthRem = compact ? 0.6 : 1.05;
    const remWidth = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return cellWidthRem * remWidth + 2; // 2px margins
  }, [compact]);

  const maxCellsPerLine = useMemo(() => Math.floor(containerWidth / cellWidth), [cellWidth, containerWidth]);
  let lineWidth = totalCells;
  let numLines = 1;
  if (lineWidth > maxCellsPerLine) {
    numLines = Math.floor(lineWidth / maxCellsPerLine) + 1;
    lineWidth = Math.ceil(totalCells / numLines);
  }

  const generateNElements = (n: number, generateElement: (index: number) => JSX.Element) => {
    if (n < 1) {
      return [];
    }

    return [...Array(n)].map((value, index) => generateElement(index));
  };

  const cells = [
    ...generateNElements(signupCount, (index) => (
      <div className={`bucket-availability-cell ${styles.bucketAvailabilityCell}`} key={`signedup-${index}`}>
        <i className="bi-person-circle" />
      </div>
    )),
    ...generateNElements(remainingCapacity, (index) => (
      <div className={`bucket-availability-cell ${styles.bucketAvailabilityCell}`} key={`available-${index}`}>
        <i className="bi-circle" />
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
          className={classNames('bucket-availability-display', styles.bucketAvailabilityDisplay, className, {
            'bucket-availability-display-compact': compact,
            [styles.bucketAvailabilityDisplayCompact]: compact,
          })}
          key={`line-${index}`}
        >
          {cells.slice(index * lineWidth, (index + 1) * lineWidth)}
        </div>
      ))}
    </div>
  );
}

export default BucketAvailabilityDisplay;
