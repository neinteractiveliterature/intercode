import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ScheduleGridContext } from './ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';

function ScheduleGridRowHeader({ layoutResult, rowHeader }) {
  const { schedule } = useContext(ScheduleGridContext);

  if (!schedule.shouldUseRowHeaders()) {
    return null;
  }

  return (
    <div
      className="schedule-grid-row-header"
      style={{
        width: `${PIXELS_PER_HOUR}px`,
        minWidth: `${PIXELS_PER_HOUR}px`,
        height: `${layoutResult.laneCount * PIXELS_PER_LANE + 5}px`,
      }}
    >
      <small className="schedule-grid-row-header-label">{rowHeader}</small>
    </div>
  );
}

ScheduleGridRowHeader.propTypes = {
  layoutResult: PropTypes.shape({
    laneCount: PropTypes.number.isRequired,
  }).isRequired,
  rowHeader: PropTypes.string,
};

ScheduleGridRowHeader.defaultProps = {
  rowHeader: null,
};

export default ScheduleGridRowHeader;
