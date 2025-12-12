import React, { Fragment, ReactNode, useMemo } from 'react';

import { PIXELS_PER_LANE, PIXELS_PER_HOUR } from './LayoutConstants';
import ScheduleLayoutBlock, { ScheduleLayoutResult, RunDimensions } from './ScheduleLayout/ScheduleLayoutBlock';
import ScheduleGridRowHeader from './ScheduleGridRowHeader';
import styles from '~/styles/schedule_grid.module.scss';

export type ScheduleBlockProps = {
  layoutBlock: ScheduleLayoutBlock;
  rowHeader: ReactNode;
  renderEventRun: (options: { layoutResult: ScheduleLayoutResult; runDimensions: RunDimensions }) => React.JSX.Element;
};

function ScheduleBlock({ layoutBlock, rowHeader, renderEventRun }: ScheduleBlockProps): React.JSX.Element {
  const layoutResult = useMemo(() => layoutBlock.computeLayout(), [layoutBlock]);

  const blockContentStyle = {
    // eslint-disable-next-line i18next/no-literal-string
    position: 'relative' as const,
    // eslint-disable-next-line i18next/no-literal-string
    width: `${layoutBlock.timespan.getLength('hours').hours * PIXELS_PER_HOUR}px`,
    // eslint-disable-next-line i18next/no-literal-string
    height: `${layoutResult.laneCount * PIXELS_PER_LANE}px`,
  };

  return (
    <>
      <ScheduleGridRowHeader layoutResult={layoutResult} rowHeader={rowHeader} />
      <div className={`schedule-grid-block ${styles.scheduleGridBlock}`}>
        <div style={blockContentStyle}>
          {layoutResult.runDimensions.map((runDimensions) => (
            <Fragment key={runDimensions.runId}>{renderEventRun({ layoutResult, runDimensions })}</Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScheduleBlock;
