import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ScheduleGridEventRun from './ScheduleGridEventRun';
import { PIXELS_PER_LANE, PIXELS_PER_HOUR } from './LayoutConstants';
import computeRunDimensionsWithoutSpanning from './PCSG/computeRunDimensionsWithoutSpanning';
import ScheduleGridRowHeader from './ScheduleGridRowHeader';

function ScheduleBlock({ scheduleBlock, rowHeader }) {
  const layoutResult = useMemo(
    () => computeRunDimensionsWithoutSpanning(scheduleBlock),
    [scheduleBlock],
  );

  const blockContentStyle = {
    position: 'relative',
    width: `${scheduleBlock.timespan.getLength('hour') * PIXELS_PER_HOUR}px`,
    height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
  };

  return (
    <>
      <ScheduleGridRowHeader layoutResult={layoutResult} rowHeader={rowHeader} />
      <div className="schedule-grid-block">
        <div style={blockContentStyle}>
          {layoutResult.runDimensions.map(runDimensions => (
            <ScheduleGridEventRun
              key={runDimensions.eventRun.runId}
              layoutResult={layoutResult}
              runDimensions={runDimensions}
            />
          ))}
        </div>
      </div>
    </>
  );
}

ScheduleBlock.propTypes = {
  scheduleBlock: PropTypes.shape({
    timespan: PropTypes.shape({
      getLength: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  rowHeader: PropTypes.string,
};

ScheduleBlock.defaultProps = {
  rowHeader: null,
};

export default ScheduleBlock;
