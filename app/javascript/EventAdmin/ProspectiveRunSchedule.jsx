import React, { useMemo, useContext } from 'react';
import classnames from 'classnames';

import { ScheduleGridContext, useScheduleGridProvider } from '../EventsApp/ScheduleGrid/ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from '../EventsApp/ScheduleGrid/LayoutConstants';
import useLayoutForTimespan from '../EventsApp/ScheduleGrid/useLayoutForTimespan';
import Timespan from '../Timespan';
import ScheduleGridHeaderBlock from '../EventsApp/ScheduleGrid/ScheduleGridHeaderBlock';
import useQuerySuspended from '../useQuerySuspended';
import { EventAdminEventsQuery } from './queries.gql';
import { getConventionDayTimespans, timespanFromConvention } from '../TimespanUtils';
import { getRunClassName, getRunStyle } from '../EventsApp/ScheduleGrid/StylingUtils';
import ScheduleBlock from '../EventsApp/ScheduleGrid/ScheduleBlock';

const SCHEDULE_GRID_CONFIG = {
  key: 'con_schedule_by_room',
  basename: '/events/schedule_by_room',
  title: 'Con schedule by room',
  classifyEventsBy: 'category',
  showSignupStatusBadge: true,
  showSignedUp: true,
  groupEventsBy: 'room',
  filterEmptyGroups: true,
  legends: [],
};

const FAKE_SIGNUP_COUNT_DATA = {
  runFull: () => false,
};

function MinimalEventRun({ convention, runDimensions, layoutResult }) {
  const { schedule } = useContext(ScheduleGridContext);
  const { eventRun } = runDimensions;
  const run = useMemo(
    () => schedule.getRun(eventRun.runId),
    [schedule, eventRun.runId],
  );
  const event = useMemo(
    () => {
      if (!run) {
        return null;
      }

      return schedule.getEvent(run.event_id);
    },
    [schedule, run],
  );

  if (!event) {
    return null;
  }

  return (
    <div
      className={getRunClassName({
        event,
        signupStatus: (run.id === 'prospective-run' ? 'confirmed' : null),
        config: SCHEDULE_GRID_CONFIG,
        signupCountData: FAKE_SIGNUP_COUNT_DATA,
      })}
      style={{
        ...getRunStyle({
          event,
          eventCategory: convention.event_categories.find(c => c.id === event.event_category.id),
          signupStatus: (run.id === 'prospective-run' ? 'confirmed' : null),
          config: SCHEDULE_GRID_CONFIG,
          signupCountData: FAKE_SIGNUP_COUNT_DATA,
          runDimensions,
          layoutResult,
        }),
        borderStyle: (run.id === 'prospective-run' ? 'dashed' : 'auto'),
        fontWeight: (run.id === 'prospective-run' ? 'bold' : 'auto'),
      }}
    >
      <div className="d-flex">
        <div className="p-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.title}
        </div>
      </div>
    </div>
  );
}

function ProspectiveRunSchedule({
  day, startTime, run, event,
}) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  const conventionTimespan = useMemo(
    () => (error ? null : timespanFromConvention(data.convention)),
    [error, data],
  );

  const eventsForSchedule = useMemo(
    () => {
      if (error) {
        return null;
      }

      if (startTime) {
        const fakeRun = {
          id: 'prospective-run',
          starts_at: startTime.toISOString(),
          rooms: run.rooms,
        };
        return data.events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              runs: [...e.runs.filter(r => run.id !== r.id), fakeRun],
            };
          }

          return e;
        });
      }

      return data.events;
    },
    [data.events, error, event.id, run, startTime],
  );

  const conventionDayTimespans = useMemo(
    () => (error
      ? null
      : getConventionDayTimespans(conventionTimespan, data.convention.timezone_name)),
    [conventionTimespan, data.convention.timezone_name, error],
  );

  const conventionDayTimespan = useMemo(
    () => (day
      ? conventionDayTimespans.find(cdt => cdt.overlapsTimespan(new Timespan(day.clone().add(6, 'hours'), day.clone().endOf('day'))))
      : null
    ),
    [conventionDayTimespans, day],
  );

  const scheduleGridProviderValue = useScheduleGridProvider(
    SCHEDULE_GRID_CONFIG, data.convention, eventsForSchedule,
  );
  const layout = useLayoutForTimespan(scheduleGridProviderValue.schedule, conventionDayTimespan);

  if (!layout) {
    return null;
  }

  return (
    <ScheduleGridContext.Provider value={scheduleGridProviderValue}>
      <div className="schedule-grid mb-4 bg-light" style={{ overflowX: 'auto' }}>
        <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
          <div className="mt-1 d-flex">
            {
              scheduleGridProviderValue.schedule.shouldUseRowHeaders()
                ? (<div style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px` }} />)
                : null
            }
            <ScheduleGridHeaderBlock timespan={layout.timespan} eventRuns={layout.eventRuns} />
          </div>
          {layout.blocksWithOptions.map(([scheduleBlock, options]) => (
            <div className={classnames('d-flex', { 'flex-grow-1': (options || {}).flexGrow })} key={scheduleBlock.id}>
              <ScheduleBlock
                scheduleBlock={scheduleBlock}
                rowHeader={options.rowHeader}
                renderEventRun={({ layoutResult, runDimensions }) => (
                  <MinimalEventRun
                    convention={data.convention}
                    layoutResult={layoutResult}
                    runDimensions={runDimensions}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </ScheduleGridContext.Provider>
  );
}

export default ProspectiveRunSchedule;
