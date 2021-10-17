import { ReactNode, useContext } from 'react';

import { ScheduleGridContext } from './ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';
import { ScheduleLayoutResult } from './ScheduleLayout/ScheduleLayoutBlock';

export type ScheduleGridRowHeaderProps = {
  layoutResult: ScheduleLayoutResult;
  rowHeader: ReactNode;
};

function ScheduleGridRowHeader({
  layoutResult,
  rowHeader,
}: ScheduleGridRowHeaderProps): JSX.Element {
  const { schedule } = useContext(ScheduleGridContext);

  if (!schedule.shouldUseRowHeaders()) {
    return <></>;
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

export default ScheduleGridRowHeader;
