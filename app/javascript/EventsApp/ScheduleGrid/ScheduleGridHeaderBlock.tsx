import React from 'react';

import ScheduleGridHour from './ScheduleGridHour';
import { FiniteTimespan } from '../../Timespan';
import EventRun from './PCSG/EventRun';

export type ScheduleGridHeaderBlockProps = {
  timespan: FiniteTimespan;
  eventRuns: EventRun[];
};

function ScheduleGridHeaderBlock({ timespan, eventRuns }: ScheduleGridHeaderBlockProps) {
  const now = timespan.start.clone();
  const hourDivs: JSX.Element[] = [];
  while (timespan.includesTime(now)) {
    hourDivs.push(
      <ScheduleGridHour now={now.clone()} eventRuns={eventRuns} key={now.toISOString()} />,
    );
    now.add(1, 'hour');
  }

  return <>{hourDivs}</>;
}

export default React.memo(ScheduleGridHeaderBlock);
