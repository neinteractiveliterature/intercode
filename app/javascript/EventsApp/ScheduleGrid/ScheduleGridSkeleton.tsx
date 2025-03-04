import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import styles from 'styles/schedule_grid.module.scss';

import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';

function ScheduleGridSkeleton(): JSX.Element {
  return (
    <div className={`schedule-grid mb-4 ${styles.scheduleGrid}`}>
      <div
        className={`schedule-grid-content ${styles.scheduleGridContent}`}
        style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}
      >
        <PageLoadingIndicator visible iconSet="bootstrap-icons" />
      </div>
    </div>
  );
}

export default ScheduleGridSkeleton;
