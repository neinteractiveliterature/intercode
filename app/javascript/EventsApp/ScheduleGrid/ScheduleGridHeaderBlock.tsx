import React from 'react';

import ScheduleGridHour from './ScheduleGridHour';
import { FiniteTimespan } from '../../Timespan';

export type ScheduleGridHeaderBlockProps = {
  timespan: FiniteTimespan;
  runIds: number[];
};

function ScheduleGridHeaderBlock({ timespan, runIds }: ScheduleGridHeaderBlockProps) {
  const now = timespan.start.clone();
  const hourDivs: JSX.Element[] = [];
  while (timespan.includesTime(now)) {
    hourDivs.push(<ScheduleGridHour now={now.clone()} runIds={runIds} key={now.toISOString()} />);
    now.add(1, 'hour');
  }

  return <>{hourDivs}</>;
}

export default React.memo(ScheduleGridHeaderBlock);
