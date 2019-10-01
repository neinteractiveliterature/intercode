/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const MAX_CELLS_PER_LINE_REGULAR = 15;
const MAX_CELLS_PER_LINE_COMPACT = 19;

function BucketAvailabilityDisplay({
  className, signupCount, remainingCapacity, compact,
}) {
  const totalCells = signupCount + remainingCapacity;
  const maxCellsPerLine = compact ? MAX_CELLS_PER_LINE_COMPACT : MAX_CELLS_PER_LINE_REGULAR;
  let lineWidth = totalCells;
  let numLines = 1;
  if (lineWidth > maxCellsPerLine) {
    numLines = Math.floor(lineWidth / maxCellsPerLine) + 1;
    lineWidth = Math.ceil(totalCells / numLines);
  }

  const cells = [
    ...[...Array(signupCount)].map((value, index) => (
      <div className="bucket-availability-cell">
        <i key={`signedup-${index}`} className="fa fa-user-circle-o" />
      </div>
    )),
    ...[...Array(remainingCapacity)].map((value, index) => (
      <div className="bucket-availability-cell">
        <i key={`available-${index}`} className="fa fa-circle-thin" />
      </div>
    )),
  ];

  return [...Array(numLines)].map((value, index) => (
    <div
      className={classNames('bucket-availability-display', className, { 'bucket-availability-display-compact': compact })}
      key={`line-${index}`}
    >
      {cells.slice(index * lineWidth, (index + 1) * lineWidth)}
    </div>
  ));
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
