import { Fragment, ReactNode, useContext } from 'react';
import { Waypoint } from 'react-waypoint';
import { SortingRule } from '@tanstack/react-table';
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
  sortBy?: SortingRule<NonNullable<EventListEventsQueryData['convention']>['events_paginated']['entries'][number]>[];
  canReadSchedule: boolean;
  fetchMoreIfNeeded: () => void;
};

function EventListEvents({
  convention,
  eventsPaginated,
  sortBy,
  canReadSchedule,
  fetchMoreIfNeeded,
}: EventListEventsProps): JSX.Element {
  const format = useAppDateTimeFormat();
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
            if (conventionDay && (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))) {
              preamble = <h3 className="mt-4">{format(conventionDay.start, 'longWeekdayDate')}</h3>;
              previousConventionDay = conventionDay;
            }
          }
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
