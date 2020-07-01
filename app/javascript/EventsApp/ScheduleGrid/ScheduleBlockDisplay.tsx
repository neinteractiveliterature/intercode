import React, { useMemo, ReactNode, CSSProperties } from 'react';

import { PIXELS_PER_LANE, PIXELS_PER_HOUR } from './LayoutConstants';
import computeRunDimensionsWithoutSpanning from './PCSG/computeRunDimensionsWithoutSpanning';
import ScheduleGridRowHeader from './ScheduleGridRowHeader';
import ScheduleBlock from './PCSG/ScheduleBlock';

export type ScheduleBlockDisplayProps = {
  scheduleBlock: ScheduleBlock,
  rowHeader?: string,
  renderEventRun: ({
    layoutResult: ScheduleLayoutResult, runDimensions: RunDimensions,
  }) => ReactNode,
};

function ScheduleBlockDisplay(
  { scheduleBlock, rowHeader, renderEventRun }: ScheduleBlockDisplayProps,
) {
  const layoutResult = useMemo(
    () => computeRunDimensionsWithoutSpanning(scheduleBlock),
    [scheduleBlock],
  );

  const blockContentStyle: CSSProperties = {
    position: 'relative',
    width: `${scheduleBlock.timespan.getLength('hour') * PIXELS_PER_HOUR}px`,
    height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
  };

  return (
    <>
      <ScheduleGridRowHeader layoutResult={layoutResult} rowHeader={rowHeader} />
      <div className="schedule-grid-block">
        <div style={blockContentStyle}>
          {layoutResult.runDimensions.map((runDimensions) => (
            <React.Fragment key={runDimensions.eventRun.runId}>
              {renderEventRun({ layoutResult, runDimensions })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScheduleBlockDisplay;
