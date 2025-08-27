import { memo } from 'react';

import ScheduleGridHour from './ScheduleGridHour';
import { FiniteTimespan } from '../../Timespan';

export type ScheduleGridHeaderBlockProps = {
  timespan: FiniteTimespan;
  runIds: string[];
};

function ScheduleGridHeaderBlock({ timespan, runIds }: ScheduleGridHeaderBlockProps) {
  let now = timespan.start;
  const hourDivs: React.JSX.Element[] = [];
  while (timespan.includesTime(now)) {
    hourDivs.push(<ScheduleGridHour now={now} runIds={runIds} key={now.toISO()} />);
    now = now.plus({ hours: 1 });
  }

  return <>{hourDivs}</>;
}

export default memo(ScheduleGridHeaderBlock);
