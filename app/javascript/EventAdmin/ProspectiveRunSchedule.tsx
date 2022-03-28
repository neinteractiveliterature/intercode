import { useMemo, useContext, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { DateTime } from 'luxon';
import { LoadQueryWrapper, notEmpty } from '@neinteractiveliterature/litform';

import { ScheduleGridContext, useScheduleGridProvider } from '../EventsApp/ScheduleGrid/ScheduleGridContext';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from '../EventsApp/ScheduleGrid/LayoutConstants';
import useLayoutForTimespan from '../EventsApp/ScheduleGrid/useLayoutForTimespan';
import Timespan from '../Timespan';
import ScheduleGridHeaderBlock from '../EventsApp/ScheduleGrid/ScheduleGridHeaderBlock';
import { getConventionDayTimespans, timespanFromConvention, ConventionForTimespanUtils } from '../TimespanUtils';
import {
  getRunClassName,
  getRunStyle,
  SignupStatus,
  GetEventCategoryStylesOptions,
} from '../EventsApp/ScheduleGrid/StylingUtils';
import ScheduleBlock from '../EventsApp/ScheduleGrid/ScheduleBlock';
import AvailabilityBar from '../EventsApp/ScheduleGrid/AvailabilityBar';
import AppRootContext from '../AppRootContext';
import { RunDimensions, ScheduleLayoutResult } from '../EventsApp/ScheduleGrid/ScheduleLayout/ScheduleLayoutBlock';
import { ScheduleGridConfig } from '../EventsApp/ScheduleGrid/ScheduleGridConfig';
import {
  useEventAdminEventsQuery,
  EventFieldsFragment,
  RunFieldsFragment,
  EventAdminEventsQueryData,
  EventAdminEventsQueryVariables,
} from './queries.generated';
import { ScheduleGridEventFragment } from '../EventsApp/ScheduleGrid/queries.generated';
import { ScheduleRun } from '../EventsApp/ScheduleGrid/Schedule';

const SCHEDULE_GRID_CONFIG: ScheduleGridConfig = {
  key: 'con_schedule_by_room',
  icon: 'bi-calendar',
  titlei18nKey: 'admin.events.prospectiveRunSchedule.title',
  classifyEventsBy: 'category',
  showSignupStatusBadge: true,
  showSignedUp: true,
  groupEventsBy: 'room',
  filterEmptyGroups: true,
  legends: [],
};

const FAKE_SIGNUP_COUNT_DATA = {
  runFull: () => false,
  getConfirmedLimitedSignupCount: () => 0,
  getNotCountedConfirmedSignupCount: () => 0,
};

type ProspectiveRun = ScheduleRun & {
  prospectiveRun: true;
};

function isProspectiveRun(run: ScheduleRun | undefined | null): run is ProspectiveRun {
  if (run == null) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(run, 'prospectiveRun') && (run as ProspectiveRun).prospectiveRun === true;
}

type ProspectiveRunScheduleEventRunProps = {
  convention: ConventionForTimespanUtils & {
    event_categories: (GetEventCategoryStylesOptions['eventCategory'] & { id: string })[];
  };
  runDimensions: RunDimensions;
  layoutResult: ScheduleLayoutResult;
};

function ProspectiveRunScheduleEventRun({
  convention,
  runDimensions,
  layoutResult,
}: ProspectiveRunScheduleEventRunProps) {
  const { schedule } = useContext(ScheduleGridContext);
  const { runId } = runDimensions;
  const run = useMemo(() => schedule.getRun(runId), [schedule, runId]);
  const runRef = useRef<HTMLDivElement>(null);
  const event = useMemo(() => {
    if (!run) {
      return undefined;
    }

    return schedule.getEvent(run.event_id);
  }, [schedule, run]);

  const runStyle = useMemo(
    () =>
      getRunStyle({
        event: event ?? {},
        eventCategory: convention.event_categories.find((c) => c.id === event?.event_category.id) ?? {},
        signupStatus: isProspectiveRun(run) ? SignupStatus.Confirmed : null,
        config: SCHEDULE_GRID_CONFIG,
        signupCountData: FAKE_SIGNUP_COUNT_DATA,
        disableDetailsPopup: true,
        runDimensions,
        layoutResult,
      }),
    [convention, runDimensions, layoutResult, event, run],
  );

  useEffect(() => {
    if (isProspectiveRun(run) && runRef.current) {
      runRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [run, runDimensions]);

  if (!event) {
    return null;
  }

  return (
    <div
      ref={runRef}
      className={getRunClassName({
        event,
        signupStatus: isProspectiveRun(run) ? SignupStatus.Confirmed : undefined,
        config: SCHEDULE_GRID_CONFIG,
        signupCountData: FAKE_SIGNUP_COUNT_DATA,
        unlimited: !event.registration_policy?.slots_limited,
        runDimensions,
      })}
      style={{
        ...runStyle,
        borderStyle: isProspectiveRun(run) ? 'dashed' : 'auto',
        fontWeight: isProspectiveRun(run) ? 'bold' : undefined,
      }}
    >
      <div className="schedule-grid-event-content">
        <AvailabilityBar
          availabilityFraction={0}
          runStyle={runStyle}
          unlimited={!event.registration_policy?.slots_limited}
        />
        <div className="schedule-grid-event-content-main">{event.title}</div>
      </div>
    </div>
  );
}

export type ProspectiveRunScheduleProps = {
  day?: DateTime;
  runs: Omit<
    RunFieldsFragment,
    | 'grouped_signup_counts'
    | 'confirmed_signup_count'
    | 'not_counted_signup_count'
    | 'room_names'
    | 'my_signups'
    | 'my_signup_requests'
  >[];
  event: EventFieldsFragment;
};

export default LoadQueryWrapper<EventAdminEventsQueryData, EventAdminEventsQueryVariables, ProspectiveRunScheduleProps>(
  useEventAdminEventsQuery,
  function ProspectiveRunSchedule({ day, runs, event, data }): JSX.Element {
    const { timezoneName } = useContext(AppRootContext);

    const conventionTimespan = useMemo(() => timespanFromConvention(data.convention), [data]);

    const prospectiveRuns: ProspectiveRun[] = useMemo(
      () =>
        runs.map((run) => ({
          __typename: 'Run',
          id: run.id,
          event_id: event.id,
          starts_at: run.starts_at,
          rooms: run.rooms,
          schedule_note: null,
          title_suffix: null,
          prospectiveRun: true,
          confirmed_signup_count: 0,
          not_counted_signup_count: 0,
          grouped_signup_counts: [],
          room_names: (run.rooms ?? []).map((room) => room.name).filter(notEmpty),
          my_signups: [],
          my_signup_requests: [],
        })),
      [runs, event.id],
    );

    const eventsForSchedule: ScheduleGridEventFragment[] | undefined = useMemo(() => {
      const filteredEvents = data.convention.events.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            runs: [...e.runs.filter((r) => runs.find((run) => run.id === r.id) == null)],
          };
        }

        return e;
      });

      const effectiveEvents = filteredEvents.some((e) => e.id === event.id)
        ? filteredEvents
        : [...filteredEvents, event];

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
    }, [data, event, prospectiveRuns, runs]);

    const conventionDayTimespans = useMemo(
      () => (conventionTimespan?.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : undefined),
      [conventionTimespan, timezoneName],
    );

    const conventionDayTimespan = useMemo(() => {
      if (!day) {
        return undefined;
      }
      const dayTimespan = Timespan.finiteFromDateTimes(day, day.endOf('day'));
      return conventionDayTimespans?.find((cdt) => cdt.overlapsTimespan(dayTimespan));
    }, [conventionDayTimespans, day]);

    const scheduleGridProviderValue = useScheduleGridProvider(
      SCHEDULE_GRID_CONFIG,
      data?.convention ?? undefined,
      eventsForSchedule,
    );
    const layout = useLayoutForTimespan(scheduleGridProviderValue.schedule, conventionDayTimespan);

    if (!layout) {
      return <></>;
    }

    return (
      <ScheduleGridContext.Provider value={scheduleGridProviderValue}>
        <div className="schedule-grid mb-4" style={{ overflowX: 'auto' }}>
          <div
            className="schedule-grid-content"
            style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}
          >
            <div className="mt-1 d-flex">
              {scheduleGridProviderValue.schedule.shouldUseRowHeaders() ? (
                <div style={{ width: `${PIXELS_PER_HOUR}px`, minWidth: `${PIXELS_PER_HOUR}px` }} />
              ) : null}
              <ScheduleGridHeaderBlock timespan={layout.timespan} runIds={layout.runIds} />
            </div>
            {layout.blocksWithOptions.map(([layoutBlock, options]) => (
              <div className={classnames('d-flex', { 'flex-grow-1': (options || {}).flexGrow })} key={layoutBlock.id}>
                <ScheduleBlock
                  layoutBlock={layoutBlock}
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
  },
);
