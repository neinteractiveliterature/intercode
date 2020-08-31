import React, { useContext } from 'react';
import { Moment } from 'moment';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';
import EventRun from './PCSG/EventRun';

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
  eventRuns: EventRun[];
};

function ScheduleGridHour({ now, eventRuns }: ScheduleGridHourProps) {
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
        {config.showExtendedCounts && (
          <ScheduleGridExtendedCounts now={now} eventRuns={eventRuns} />
        )}
      </div>
    </div>
  );
}

export default ScheduleGridHour;
