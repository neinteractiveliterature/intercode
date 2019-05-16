import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';

function formatTime(time, timezoneName) {
  const timeInZone = time.tz(timezoneName);
  let phrasing;
  if (timeInZone.hour() === 0) {
    phrasing = 'Midnight';
  } else if (timeInZone.hour() === 12) {
    phrasing = 'Noon';
  } else {
    phrasing = timeInZone.format('h:mma');
  }

  return phrasing;
}

function ScheduleGridHour({ now, eventRuns }) {
  const { schedule, config } = useContext(ScheduleGridContext);
  return (
    <div key={now.toISOString()} style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px`, overflow: 'hidden' }}>
      <div className="small text-muted ml-1">
        {formatTime(now, schedule.timezoneName)}
        {config.showExtendedCounts && (
          <ScheduleGridExtendedCounts now={now} eventRuns={eventRuns} />
        )}
      </div>
    </div>
  );
}

ScheduleGridHour.propTypes = {
  now: MomentPropTypes.momentObj.isRequired,
  eventRuns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default ScheduleGridHour;
