import React from 'react';

import PageLoadingIndicator from '../../PageLoadingIndicator';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';

function ScheduleGridSkeleton() {
  return (
    <div className="schedule-grid mb-4">
      <div
        className="schedule-grid-content"
        style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}
      >
        <PageLoadingIndicator visible />
      </div>
    </div>
  );
}

export default ScheduleGridSkeleton;
