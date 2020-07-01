import React, { useContext } from 'react';
import { DateTime } from 'luxon';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';
import { lowercaseMeridiem } from '../../TimeUtils';
import EventRun from './PCSG/EventRun';

function formatTime(time: DateTime, timezoneName: string) {
  const timeInZone = time.setZone(timezoneName);
  let phrasing;
  if (timeInZone.hour === 0) {
    phrasing = 'Midnight';
  } else if (timeInZone.hour === 12) {
    phrasing = 'Noon';
  } else {
    phrasing = lowercaseMeridiem(timeInZone.toFormat('h:mma'));
  }

  return phrasing;
}

export type ScheduleGridHourProps = {
  now: DateTime,
  eventRuns: EventRun[],
};

function ScheduleGridHour({ now, eventRuns }: ScheduleGridHourProps) {
  const { schedule, config } = useContext(ScheduleGridContext);
  return (
    <div key={now.valueOf()} style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, overflow: 'hidden' }}>
      <div className="small text-muted ml-1">
        {formatTime(now, schedule.timezoneName)}
        {config.showExtendedCounts && (
          <ScheduleGridExtendedCounts now={now} eventRuns={eventRuns} />
        )}
      </div>
    </div>
  );
}

export default ScheduleGridHour;
