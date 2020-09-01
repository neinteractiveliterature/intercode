import React, { ReactNode, useMemo } from 'react';

import { PIXELS_PER_LANE, PIXELS_PER_HOUR } from './LayoutConstants';
import computeRunDimensionsWithoutSpanning from './PCSG/computeRunDimensionsWithoutSpanning';
import ScheduleGridRowHeader from './ScheduleGridRowHeader';
import ScheduleBlockData from './PCSG/ScheduleBlock';
import { ScheduleLayoutResult } from './PCSG/ScheduleLayoutResult';
import { RunDimensions } from './PCSG/RunDimensions';

export type ScheduleBlockProps = {
  scheduleBlock: ScheduleBlockData;
  rowHeader: ReactNode;
  renderEventRun: (options: {
    layoutResult: ScheduleLayoutResult;
    runDimensions: RunDimensions;
  }) => JSX.Element;
};

function ScheduleBlock({ scheduleBlock, rowHeader, renderEventRun }: ScheduleBlockProps) {
  const layoutResult = useMemo(() => computeRunDimensionsWithoutSpanning(scheduleBlock), [
    scheduleBlock,
  ]);

  const blockContentStyle = {
    position: 'relative' as const,
    width: `${scheduleBlock.timespan.getLength('hour') * PIXELS_PER_HOUR}px`,
    height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
  };

  return (
    <>
      <ScheduleGridRowHeader layoutResult={layoutResult} rowHeader={rowHeader} />
      <div className="schedule-grid-block">
        <div style={blockContentStyle}>
          {layoutResult.runDimensions.map((runDimensions) => (
            <React.Fragment key={runDimensions.runId}>
              {renderEventRun({ layoutResult, runDimensions })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScheduleBlock;
