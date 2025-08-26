import { useContext } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import ScheduleGridExtendedCounts from './ScheduleGridExtendedCounts';
import { PIXELS_PER_HOUR } from './LayoutConstants';
import { ScheduleGridContext } from './ScheduleGridContext';
import { humanizeTime } from '../../TimeUtils';

export type ScheduleGridHourProps = {
  now: DateTime;
  runIds: string[];
};

function ScheduleGridHour({ now, runIds }: ScheduleGridHourProps): React.JSX.Element {
  const { t } = useTranslation();
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
      <div className="small text-muted ms-1">
        {humanizeTime(now.setZone(schedule.timezoneName), t)}
        {config.showExtendedCounts && <ScheduleGridExtendedCounts now={now} runIds={runIds} />}
      </div>
    </div>
  );
}

export default ScheduleGridHour;
