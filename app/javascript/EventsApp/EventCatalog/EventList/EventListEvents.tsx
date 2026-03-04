import { Fragment, ReactNode, useContext, useMemo } from 'react';
import { Waypoint } from 'react-waypoint';
import { SortingState } from '@tanstack/react-table';
import { DateTime } from 'luxon';

import EventCard from './EventCard';
import getSortedRuns from './getSortedRuns';
import { timespanFromConvention, getConventionDayTimespans } from '../../../TimespanUtils';
import AppRootContext from '../../../AppRootContext';
import { EventListEventsQueryData } from './queries.generated';
import { FiniteTimespan } from '../../../Timespan';
import { useAppDateTimeFormat } from '../../../TimeUtils';
import { CommonConventionDataFragment } from '../../queries.generated';

export type EventListEventsProps = {
  convention: NonNullable<EventListEventsQueryData['convention']>;
  eventsPaginated: Omit<NonNullable<EventListEventsQueryData['convention']>['events_paginated'], 'entries'> & {
    entries: (EventListEventsQueryData['convention']['events_paginated']['entries'][number] & {
      event_category: CommonConventionDataFragment['event_categories'][number];
    })[];
  };
  sortBy?: SortingState;
  canReadSchedule: boolean;
  fetchMoreIfNeeded: () => void;
};

function EventListEvents({
  convention,
  eventsPaginated,
  sortBy,
  canReadSchedule,
  fetchMoreIfNeeded,
}: EventListEventsProps): React.JSX.Element {
  const format = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);

  const conventionDayTimespans: FiniteTimespan[] = useMemo(() => {
    const conventionTimespan = timespanFromConvention(convention);
    if (conventionTimespan.isFinite()) {
      return getConventionDayTimespans(conventionTimespan, timezoneName);
    } else {
      return [];
    }
  }, [convention, timezoneName]);

  const conventionDayStartsByEventId = useMemo(() => {
    const eventIds = new Map();
    if (sortBy?.some((sort) => sort.id === 'first_scheduled_run_start')) {
      let previousConventionDay: FiniteTimespan | null = null;
      for (const event of eventsPaginated.entries) {
        const runs = getSortedRuns(event);
        if (runs.length > 0) {
          const conventionDay = conventionDayTimespans.find((timespan) =>
            timespan.includesTime(DateTime.fromISO(runs[0].starts_at, { zone: timezoneName })),
          );
          if (conventionDay && (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))) {
            previousConventionDay = conventionDay;
          }
          if (conventionDay && (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))) {
            eventIds.set(event.id, conventionDay.start);
          }
        }
      }
    }
    return eventIds;
  }, [conventionDayTimespans, eventsPaginated.entries, sortBy, timezoneName]);

  return (
    <>
      {eventsPaginated.entries.map((event, index) => {
        let preamble: ReactNode = null;
        if (conventionDayStartsByEventId.has(event.id)) {
          preamble = <h3 className="mt-4">{format(conventionDayStartsByEventId.get(event.id), 'longWeekdayDate')}</h3>;
        }

        const eventContent = (
          <Fragment key={event.id}>
            {preamble}
            <EventCard convention={convention} event={event} sortBy={sortBy} canReadSchedule={canReadSchedule} />
          </Fragment>
        );

        if (index === eventsPaginated.entries.length - 5) {
          return (
            <Waypoint fireOnRapidScroll onEnter={fetchMoreIfNeeded} key={`waypoint-${event.id}`}>
              <div>{eventContent}</div>
            </Waypoint>
          );
        }

        return eventContent;
      })}
    </>
  );
}

export default EventListEvents;
