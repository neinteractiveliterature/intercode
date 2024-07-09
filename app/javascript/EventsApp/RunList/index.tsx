import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';

import AppRootContext from '../../AppRootContext';
import { FiniteTimespan } from '../../Timespan';
import { timespanFromRun } from '../../TimespanUtils';
import { useAppDateTimeFormat } from '../../TimeUtils';
import usePageTitle from '../../usePageTitle';
import { useConventionDayUrlPortion } from '../ScheduleGrid/ConventionDayTabContainer';
import { PIXELS_PER_LANE } from '../ScheduleGrid/LayoutConstants';
import { usePersonalScheduleFilters } from '../ScheduleGrid/PersonalScheduleFiltersBar';
import { ScheduleGridConventionDataQueryData, useScheduleGridEventsQuery } from '../ScheduleGrid/queries.generated';
import { findConflictingRuns } from '../ScheduleGrid/Schedule';
import SignupCountData from '../SignupCountData';
import RunListEventRun from './RunListEventRun';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';
import { EventFiltersInput } from '../../graphqlTypes.generated';
import useMergeCategoriesIntoEvents from '../useMergeCategoriesIntoEvents';

// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.left >= 0 && rect.top >= 0 && rect.left + rect.width <= windowWidth && rect.top + rect.height <= windowHeight
  );
}

export type RunListProps = {
  convention: ScheduleGridConventionDataQueryData['convention'];
  fetchFormItemIdentifiers: string[];
  filters?: EventFiltersInput;
};

export default LoadQueryWithVariablesWrapper(
  useScheduleGridEventsQuery,
  ({ fetchFormItemIdentifiers, filters }: RunListProps) => ({ fetchFormItemIdentifiers, filters }),
  function RunList({ data, convention }) {
    const { timezoneName, myProfile } = useContext(AppRootContext);
    const format = useAppDateTimeFormat();
    const { ratingFilter, hideConflicts } = usePersonalScheduleFilters({
      showPersonalFilters: true,
      signedIn: myProfile != null,
    });
    const navigate = useNavigate();
    const conventionDayUrlPortion = useConventionDayUrlPortion();
    const conventionDayHeaders = useRef(new Map<string, HTMLElement>());
    const location = useLocation();
    const conventionDay = useParams<{ conventionDay: string }>().conventionDay;
    const { t } = useTranslation();

    usePageTitle(`${t('navigation.events.eventSchedule')} (${t('schedule.views.listView')})`);

    useLayoutEffect(() => {
      if (conventionDay) {
        const header = conventionDayHeaders.current.get(conventionDay);
        if (header && !isElementInViewport(header)) {
          header.scrollIntoView(true);
          window.scrollBy(0, -100);
        }
      }
    }, [conventionDay]);

    const eventsWithCategories = useMergeCategoriesIntoEvents(
      convention?.event_categories ?? [],
      data.convention.events,
    );

    const eventsByRunId = useMemo(() => {
      const eventMap = new Map<
        string,
        (typeof data)['convention']['events'][number] & {
          event_category: ScheduleGridConventionDataQueryData['convention']['event_categories'][number];
        }
      >();
      eventsWithCategories.forEach((event) => {
        event.runs.forEach((run) => {
          eventMap.set(run.id, event);
        });
      });
      return eventMap;
    }, [eventsWithCategories]);

    const sortedRuns = useMemo(
      () =>
        sortBy(
          flatMap(data.convention.events, (event) => event.runs),
          (run) => [DateTime.fromISO(run.starts_at).valueOf(), eventsByRunId.get(run.id)?.title?.toLocaleLowerCase()],
        ),
      [data.convention.events, eventsByRunId],
    );

    type RunGroup = {
      dayStart: DateTime;
      timeGroups: { startTime: DateTime; runs: typeof sortedRuns }[];
    };

    const runGroups = useMemo<RunGroup[]>(
      () =>
        sortedRuns.reduce((acc: RunGroup[], run) => {
          const currentGroup = acc.length > 0 ? acc[acc.length - 1] : undefined;
          const runStart = DateTime.fromISO(run.starts_at, { zone: timezoneName });
          const dayStart = runStart.startOf('day');

          if (currentGroup && currentGroup.dayStart.valueOf() === dayStart.valueOf()) {
            // we're in the same day as the previous run
            const currentTimeGroup = currentGroup.timeGroups[currentGroup.timeGroups.length - 1];
            if (currentTimeGroup.startTime.valueOf() === runStart.valueOf()) {
              // this run starts at the same time as the previous run
              return [
                ...acc.slice(0, acc.length - 1),
                {
                  ...currentGroup,
                  timeGroups: [
                    ...currentGroup.timeGroups.slice(0, currentGroup.timeGroups.length - 1),
                    { ...currentTimeGroup, runs: [...currentTimeGroup.runs, run] },
                  ],
                },
              ];
            }

            // this run doesn't start at the same time as the previous run, start a new timeGroup
            return [
              ...acc.slice(0, acc.length - 1),
              {
                ...currentGroup,
                timeGroups: [...currentGroup.timeGroups, { startTime: runStart, runs: [run] }],
              },
            ];
          }

          // we're in a new day (or we're in the very first run), start a new runGroup
          return [...acc, { dayStart, timeGroups: [{ startTime: runStart, runs: [run] }] }];
        }, []),
      [sortedRuns, timezoneName],
    );

    const timespanByRunId = useMemo(() => {
      const timespanMap = new Map<string, FiniteTimespan>();
      data.convention.events.forEach((event) => {
        event.runs.forEach((run) => {
          timespanMap.set(run.id, timespanFromRun(timezoneName, event, run));
        });
      });
      return timespanMap;
    }, [data.convention.events, timezoneName]);

    const signupCountDataByRunId = useMemo(() => {
      const countMap = new Map<string, SignupCountData>();
      data.convention.events.forEach((event) => {
        event.runs.forEach((run) => {
          countMap.set(run.id, SignupCountData.fromRun(run));
        });
      });
      return countMap;
    }, [data.convention.events]);

    const conflictingRuns = useMemo(() => findConflictingRuns(data.convention.events), [data.convention.events]);

    const enteredRunGroup = useCallback(
      (runGroup: RunGroup) => {
        navigate(`/events/schedule/${conventionDayUrlPortion(runGroup.dayStart)}${location.search}`);
      },
      [navigate, location.search, conventionDayUrlPortion],
    );

    return (
      <>
        {runGroups.map(({ dayStart, timeGroups }) => (
          <React.Fragment key={dayStart.valueOf()}>
            <div
              className="schedule-list-day-header"
              ref={(element) => {
                if (element) {
                  conventionDayHeaders.current.set(conventionDayUrlPortion(dayStart), element);
                } else {
                  conventionDayHeaders.current.delete(conventionDayUrlPortion(dayStart));
                }
              }}
            >
              <h3 className="pb-1">{format(dayStart, 'longWeekdayDate')}</h3>
            </div>
            <Waypoint topOffset="50%" onEnter={() => enteredRunGroup({ dayStart, timeGroups })}>
              <div>
                {timeGroups.map(({ startTime, runs }) => {
                  const filteredRuns = runs.filter((run) => {
                    const event = eventsByRunId.get(run.id);
                    const timespan = timespanByRunId.get(run.id);

                    if (!event || !timespan) {
                      return false;
                    }

                    if (
                      hideConflicts &&
                      conflictingRuns.some(
                        (conflictingRun) =>
                          conflictingRun.id !== run.id &&
                          timespanByRunId.get(conflictingRun.id)?.overlapsTimespan(timespan),
                      )
                    ) {
                      return false;
                    }

                    if (myProfile && !ratingFilter.includes(event.my_rating ?? 0)) {
                      return false;
                    }
                    return true;
                  });

                  return (
                    <React.Fragment key={startTime.valueOf()}>
                      <div className="mt-2">{format(startTime, 'shortTimeWithZone')}</div>
                      {filteredRuns.map((run) => {
                        const event = eventsByRunId.get(run.id);
                        const timespan = timespanByRunId.get(run.id);
                        const signupCountData = signupCountDataByRunId.get(run.id);

                        if (!event || !timespan || !signupCountData) {
                          return <React.Fragment key={run.id}></React.Fragment>;
                        }

                        return (
                          <div className="ps-4" key={run.id}>
                            <div
                              style={{
                                position: 'relative',
                                width: '100%',
                                height: `${PIXELS_PER_LANE}px`,
                              }}
                            >
                              <RunListEventRun
                                event={event}
                                run={run}
                                timespan={timespan}
                                signupCountData={signupCountData}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {filteredRuns.length < runs.length && (
                        <div className="ps-4 text-muted">+{runs.length - filteredRuns.length} hidden</div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Waypoint>
          </React.Fragment>
        ))}
      </>
    );
  },
);
