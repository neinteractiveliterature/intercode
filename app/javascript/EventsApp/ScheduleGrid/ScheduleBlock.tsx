import { Fragment, ReactNode, useMemo } from 'react';

import { PIXELS_PER_LANE, PIXELS_PER_HOUR } from './LayoutConstants';
import ScheduleLayoutBlock, {
  ScheduleLayoutResult,
  RunDimensions,
} from './ScheduleLayout/ScheduleLayoutBlock';
import ScheduleGridRowHeader from './ScheduleGridRowHeader';

export type ScheduleBlockProps = {
  layoutBlock: ScheduleLayoutBlock;
  rowHeader: ReactNode;
  renderEventRun: (options: {
    layoutResult: ScheduleLayoutResult;
    runDimensions: RunDimensions;
  }) => JSX.Element;
};

function ScheduleBlock({ layoutBlock, rowHeader, renderEventRun }: ScheduleBlockProps) {
  const layoutResult = useMemo(() => layoutBlock.computeLayout(), [layoutBlock]);

  const blockContentStyle = {
    position: 'relative' as const,
    width: `${layoutBlock.timespan.getLength('hours').hours * PIXELS_PER_HOUR}px`,
    height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
  };

  return (
    <>
      <ScheduleGridRowHeader layoutResult={layoutResult} rowHeader={rowHeader} />
      <div className="schedule-grid-block">
        <div style={blockContentStyle}>
          {layoutResult.runDimensions.map((runDimensions) => (
            <Fragment key={runDimensions.runId}>
              {renderEventRun({ layoutResult, runDimensions })}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScheduleBlock;
