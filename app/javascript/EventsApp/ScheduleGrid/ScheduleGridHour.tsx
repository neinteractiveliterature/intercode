import { useContext } from 'react';
import { DateTime } from 'luxon';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';
import { formatLCM } from '../../TimeUtils';

function formatTime(time: DateTime, timezoneName: string) {
  const timeInZone = time.setZone(timezoneName);
  if (timeInZone.hour === 0) {
    return 'Midnight';
  }
  if (timeInZone.hour === 12) {
    return 'Noon';
  }
  return formatLCM(timeInZone, 'h:mmaaa');
}

export type ScheduleGridHourProps = {
  now: DateTime;
  runIds: number[];
};

function ScheduleGridHour({ now, runIds }: ScheduleGridHourProps) {
  const { schedule, config } = useContext(ScheduleGridContext);
  return (
    <div
      key={now.toISO()}
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
