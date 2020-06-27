import React, {
  useMemo, useContext, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MomentPropTypes from 'react-moment-proptypes';
import { DateTime } from 'luxon';

import { ScheduleGridContext, useScheduleGridProvider } from '../EventsApp/ScheduleGrid/ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from '../EventsApp/ScheduleGrid/LayoutConstants';
import useLayoutForTimespan from '../EventsApp/ScheduleGrid/useLayoutForTimespan';
import Timespan from '../Timespan';
import ScheduleGridHeaderBlock from '../EventsApp/ScheduleGrid/ScheduleGridHeaderBlock';
import { getConventionDayTimespans, timespanFromConvention } from '../TimespanUtils';
import { getRunClassName, getRunStyle } from '../EventsApp/ScheduleGrid/StylingUtils';
import ScheduleBlock from '../EventsApp/ScheduleGrid/ScheduleBlock';
import AvailabilityBar from '../EventsApp/ScheduleGrid/AvailabilityBar';
import AppRootContext from '../AppRootContext';
import { useEventAdminEventsQueryQuery, RunFieldsFragment, EventFieldsFragment } from '../graphqlQueries';

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

const PROSPECTIVE_RUN_ID_PREFIX = 'prospective-run-';

function ProspectiveRunScheduleEventRun({ convention, runDimensions, layoutResult }) {
  const { schedule } = useContext(ScheduleGridContext);
  const { eventRun } = runDimensions;
  const run = useMemo(
    () => schedule.getRun(eventRun.runId),
    [schedule, eventRun.runId],
  );
  const runRef = useRef(null);
  const event = useMemo(
    () => {
      if (!run) {
        return null;
      }

      return schedule.getEvent(run.event_id);
    },
    [schedule, run],
  );

  const runStyle = useMemo(
    () => getRunStyle({
      event,
      eventCategory: convention.event_categories.find((c) => c.id === event.event_category.id),
      signupStatus: (`${run.id}`.startsWith(PROSPECTIVE_RUN_ID_PREFIX) ? 'confirmed' : null),
      config: SCHEDULE_GRID_CONFIG,
      signupCountData: FAKE_SIGNUP_COUNT_DATA,
      runDimensions,
      layoutResult,
    }),
    [convention, runDimensions, layoutResult, event, run],
  );

  useEffect(
    () => {
      if (run.id === PROSPECTIVE_RUN_ID_PREFIX && runRef.current) {
        runRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    },
    [run.id, runDimensions],
  );

  if (!event) {
    return null;
  }

  return (
    <div
      ref={runRef}
      className={getRunClassName({
        event,
        signupStatus: (`${run.id}`.startsWith(PROSPECTIVE_RUN_ID_PREFIX) ? 'confirmed' : null),
        config: SCHEDULE_GRID_CONFIG,
        signupCountData: FAKE_SIGNUP_COUNT_DATA,
        unlimited: !event.registration_policy.slots_limited,
      })}
      style={{
        ...runStyle,
        borderStyle: (`${run.id}`.startsWith(PROSPECTIVE_RUN_ID_PREFIX) ? 'dashed' : 'auto'),
        fontWeight: (`${run.id}`.startsWith(PROSPECTIVE_RUN_ID_PREFIX) ? 'bold' : 'auto'),
      }}
    >
      <div className="schedule-grid-event-content">
        <AvailabilityBar
          availabilityFraction={0}
          runStyle={runStyle}
          unlimited={!event.registration_policy.slots_limited}
        />
        {event.title}
      </div>
    </div>
  );
}

ProspectiveRunScheduleEventRun.propTypes = {
  convention: PropTypes.shape({
    event_categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  runDimensions: PropTypes.shape({
    eventRun: PropTypes.shape({
      runId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  }).isRequired,
  layoutResult: PropTypes.shape({}).isRequired,
};

export type ProspectiveRunScheduleProps = {
  day: DateTime,
  runs: RunFieldsFragment[],
  event: EventFieldsFragment,
};

function ProspectiveRunSchedule({ day, runs, event }: ProspectiveRunScheduleProps) {
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useEventAdminEventsQueryQuery();

  const conventionTimespan = useMemo(
    () => ((error || loading || data?.convention == null)
      ? null
      : timespanFromConvention(data.convention)),
    [error, loading, data],
  );

  const prospectiveRuns = useMemo(
    () => runs.map((run, index) => ({
      id: `${PROSPECTIVE_RUN_ID_PREFIX}-${index}`,
      starts_at: run.starts_at,
      rooms: run.rooms,
    })),
    [runs],
  );

  const eventsForSchedule = useMemo(
    () => {
      if (error || loading || data?.events == null) {
        return null;
      }

      const filteredEvents = data.events.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            runs: [...e.runs.filter((r) => runs.find((run) => run.id === r.id) == null)],
          };
        }

        return e;
      });

      const effectiveEvents = (
        filteredEvents.some((e) => e.id === event.id)
          ? filteredEvents
          : [...filteredEvents, event]
      );

      if (prospectiveRuns) {
        return effectiveEvents.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              runs: [...e.runs, ...prospectiveRuns],
            };
          }

          return e;
        });
      }

      return effectiveEvents;
    },
    [data, error, loading, event, prospectiveRuns, runs],
  );

  const conventionDayTimespans = useMemo(
    () => (conventionTimespan
      ? getConventionDayTimespans(conventionTimespan, timezoneName)
      : null),
    [conventionTimespan, timezoneName],
  );

  const conventionDayTimespan = useMemo(
    () => {
      if (!day) {
        return null;
      }
      const dayTimespan = new Timespan(day, day.endOf('day'));
      return (conventionDayTimespans ?? []).find((cdt) => cdt.overlapsTimespan(dayTimespan));
    },
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
      <div className="schedule-grid mb-4" style={{ overflowX: 'auto' }}>
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
                  <ProspectiveRunScheduleEventRun
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

ProspectiveRunSchedule.propTypes = {
  day: MomentPropTypes.momentObj.isRequired,
  runs: PropTypes.arrayOf(PropTypes.shape({
    rooms: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProspectiveRunSchedule;
