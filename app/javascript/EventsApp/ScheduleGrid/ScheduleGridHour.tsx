import { useContext } from 'react';
import { Moment } from 'moment';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';

function formatTime(time: Moment, timezoneName: string) {
  const timeInZone = time.tz(timezoneName);
  if (timeInZone.hour() === 0) {
    return 'Midnight';
  }
  if (timeInZone.hour() === 12) {
    return 'Noon';
  }
  return timeInZone.format('h:mma');
}

export type ScheduleGridHourProps = {
  now: Moment;
  runIds: number[];
};

function ScheduleGridHour({ now, runIds }: ScheduleGridHourProps) {
  const { schedule, config } = useContext(ScheduleGridContext);
  return (
    <div
      key={now.toISOString()}
      style={{
        width: `${PIXELS_PER_HOUR}px`,
        minWidth: `${PIXELS_PER_HOUR}px`,
        overflow: 'hidden',
      }}
    >
      <div className="small text-muted ml-1">
        {formatTime(now, schedule.timezoneName)}
        {config.showExtendedCounts && <ScheduleGridExtendedCounts now={now} runIds={runIds} />}
      </div>
    </div>
  );
}

export default ScheduleGridHour;
