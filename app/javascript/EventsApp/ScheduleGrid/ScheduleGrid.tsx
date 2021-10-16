import { useContext } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { ScheduleGridContext } from './ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';
import ScheduleGridHeaderBlock from './ScheduleGridHeaderBlock';
import ScheduleBlock from './ScheduleBlock';
import usePageTitle from '../../usePageTitle';
import useLayoutForTimespan from './useLayoutForTimespan';
import ScheduleGridEventRun from './ScheduleGridEventRun';
import { FiniteTimespan } from '../../Timespan';

export type ScheduleGridProps = {
  timespan: FiniteTimespan;
};

function ScheduleGrid({ timespan }: ScheduleGridProps): JSX.Element {
  const { config, schedule } = useContext(ScheduleGridContext);
  const { t } = useTranslation();

  usePageTitle(
    `${t('navigation.events.eventSchedule', 'Event Schedule')} (${t(config.titlei18nKey)})`,
  );

  const layout = useLayoutForTimespan(schedule, timespan);
  if (!layout) {
    return <></>;
  }

  return (
    <div className="schedule-grid" style={{ overflowX: 'auto' }}>
      <div
        className="schedule-grid-content"
        style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}
      >
        <div className="mt-1 d-flex">
          {schedule.shouldUseRowHeaders() ? (
            <div style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px` }} />
          ) : null}
          <ScheduleGridHeaderBlock timespan={layout.timespan} runIds={layout.runIds} />
        </div>
        {layout.blocksWithOptions.map(([layoutBlock, options]) => (
          <div
            className={classNames('d-flex', { 'flex-grow-1': (options || {}).flexGrow })}
            key={layoutBlock.id}
          >
            <ScheduleBlock
              layoutBlock={layoutBlock}
              rowHeader={options.rowHeader}
              renderEventRun={({ layoutResult, runDimensions }) => (
                <ScheduleGridEventRun
                  layoutResult={layoutResult}
                  runDimensions={runDimensions}
                  scheduleLayoutBlock={layoutBlock}
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleGrid;
