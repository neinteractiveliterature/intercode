import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';

function ScheduleGridSkeleton() {
  return (
    <div className="schedule-grid mb-4">
      <div
        className="schedule-grid-content"
        style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}
      >
        <PageLoadingIndicator visible iconSet="bootstrap-icons" />
      </div>
    </div>
  );
}

export default ScheduleGridSkeleton;
