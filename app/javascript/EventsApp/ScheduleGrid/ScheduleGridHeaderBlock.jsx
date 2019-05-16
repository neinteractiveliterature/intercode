import React from 'react';
import PropTypes from 'prop-types';
import MomentPropTypes from 'react-moment-proptypes';

import ScheduleGridHour from './ScheduleGridHour';

function ScheduleGridHeaderBlock({ timespan, eventRuns }) {
  const now = timespan.start.clone();
  const hourDivs = [];
  while (timespan.includesTime(now)) {
    hourDivs.push(<ScheduleGridHour
      now={now.clone()}
      eventRuns={eventRuns}
      key={now.toISOString()}
    />);
    now.add(1, 'hour');
  }

  return <>{hourDivs}</>;
}

ScheduleGridHeaderBlock.propTypes = {
  timespan: PropTypes.shape({
    start: MomentPropTypes.momentObj.isRequired,
    includesTime: PropTypes.func.isRequired,
  }).isRequired,
  eventRuns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default React.memo(ScheduleGridHeaderBlock);
