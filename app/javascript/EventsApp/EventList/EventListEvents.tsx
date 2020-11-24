import { Fragment, ReactNode, useContext } from 'react';
import { Waypoint } from 'react-waypoint';
import { SortingRule } from 'react-table';
import { DateTime } from 'luxon';

import EventCard from './EventCard';
import getSortedRuns from './getSortedRuns';
import { timespanFromConvention, getConventionDayTimespans } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { EventListEventsQueryQuery } from './queries.generated';
import { FiniteTimespan } from '../../Timespan';

export type EventListEventsProps = {
  convention: NonNullable<EventListEventsQueryQuery['convention']>;
  eventsPaginated: NonNullable<EventListEventsQueryQuery['convention']>['events_paginated'];
  sortBy?: SortingRule<
    NonNullable<EventListEventsQueryQuery['convention']>['events_paginated']['entries'][number]
  >[];
  canReadSchedule: boolean;
  fetchMoreIfNeeded: () => void;
};

function EventListEvents({
  convention,
  eventsPaginated,
  sortBy,
  canReadSchedule,
  fetchMoreIfNeeded,
}: EventListEventsProps) {
  const { timezoneName } = useContext(AppRootContext);
  let previousConventionDay: FiniteTimespan | null = null;
  let conventionDayTimespans: FiniteTimespan[] = [];
  const conventionTimespan = timespanFromConvention(convention);
  if (conventionTimespan.isFinite()) {
    conventionDayTimespans = getConventionDayTimespans(conventionTimespan, timezoneName);
  }

  return (
    <>
      {eventsPaginated.entries.map((event, index) => {
        let preamble: ReactNode = null;
        if (sortBy?.some((sort) => sort.id === 'first_scheduled_run_start')) {
          const runs = getSortedRuns(event);
          if (runs.length > 0) {
            const conventionDay = conventionDayTimespans.find((timespan) =>
              timespan.includesTime(DateTime.fromISO(runs[0].starts_at, { zone: timezoneName })),
            );
            if (
              conventionDay &&
              (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))
            ) {
              preamble = <h3 className="mt-4">{conventionDay.start.toFormat('cccc, MMMM d')}</h3>;
              previousConventionDay = conventionDay;
            }
          }
        }

        const eventContent = (
          <Fragment key={event.id}>
            {preamble}
            <EventCard event={event} sortBy={sortBy} canReadSchedule={canReadSchedule} />
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
