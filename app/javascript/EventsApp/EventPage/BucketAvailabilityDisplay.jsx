/* eslint-disable react/no-array-index-key */

import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function BucketAvailabilityDisplay({
  className, signupCount, remainingCapacity, compact,
}) {
  const totalCells = signupCount + remainingCapacity;
  const [containerWidth, setContainerWidth] = useState(300);

  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const measuredRef = useCallback((element) => {
    if (element !== null) {
      setContainerWidth(element.getBoundingClientRect().width);
    }
  }, []);

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

BucketAvailabilityDisplay.propTypes = {
  className: PropTypes.string,
  signupCount: PropTypes.number.isRequired,
  remainingCapacity: PropTypes.number.isRequired,
  compact: PropTypes.bool,
};

BucketAvailabilityDisplay.defaultProps = {
  className: '',
  compact: false,
};

export default BucketAvailabilityDisplay;
