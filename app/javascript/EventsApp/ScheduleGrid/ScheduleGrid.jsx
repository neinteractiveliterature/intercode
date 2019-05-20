import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ScheduleGridContext } from './ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';
import ScheduleGridHeaderBlock from './ScheduleGridHeaderBlock';
import ScheduleBlock from './ScheduleBlock';
import usePageTitle from '../../usePageTitle';

function ScheduleGrid({ timespan }) {
  const { config, convention, schedule } = useContext(ScheduleGridContext);

  usePageTitle(config.title, convention);

  const minTimespan = useMemo(
    () => {
      const min = timespan.clone();
      min.start.add(3, 'hours'); // start grid at 9am unless something is earlier
      min.finish.subtract(6, 'hours'); // end grid at midnight unless something is earlier
      return min;
    },
    [timespan],
  );

  const layout = useMemo(
    () => schedule.buildLayoutForTimespanRange(
      minTimespan,
      timespan,
    ),
    [minTimespan, schedule, timespan],
  );

  const scheduleBlockDivs = layout.blocksWithOptions.map(([scheduleBlock, options]) => (
    <div className={classNames('d-flex', { 'flex-grow-1': (options || {}).flexGrow })} key={scheduleBlock.id}>
      <ScheduleBlock scheduleBlock={scheduleBlock} rowHeader={options.rowHeader} />
    </div>
  ));

  return (
    <div className="schedule-grid mb-4 bg-light" style={{ overflowX: 'auto' }}>
      <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
        <div className="mt-1 d-flex">
          {
            schedule.shouldUseRowHeaders()
              ? (<div style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px` }} />)
              : null
          }
          <ScheduleGridHeaderBlock timespan={layout.timespan} eventRuns={layout.eventRuns} />
        </div>
        {scheduleBlockDivs}
      </div>
    </div>
  );
}

ScheduleGrid.propTypes = {
  timespan: PropTypes.shape({
    clone: PropTypes.func.isRequired,
  }).isRequired,
};

export default ScheduleGrid;
