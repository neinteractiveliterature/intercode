import React, { ReactNode } from 'react';

import ScheduleGridHour from './ScheduleGridHour';
import { FiniteTimespan } from '../../Timespan';
import EventRun from './PCSG/EventRun';

export type ScheduleGridHeaderBlockProps = {
  timespan: FiniteTimespan,
  eventRuns: EventRun[],
};

function ScheduleGridHeaderBlock({ timespan, eventRuns }: ScheduleGridHeaderBlockProps) {
  const hourDivs: ReactNode[] = [];
  let now = timespan.start;
  while (timespan.includesTime(now)) {
    hourDivs.push(<ScheduleGridHour
      now={now}
      eventRuns={eventRuns}
      key={now.valueOf()}
    />);
    now = now.plus({ hours: 1 });
  }

  return <>{hourDivs}</>;
}

export default React.memo(ScheduleGridHeaderBlock);
