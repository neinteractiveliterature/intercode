import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Waypoint } from 'react-waypoint';

import EventCard from './EventCard';
import getSortedRuns from './getSortedRuns';
import { timespanFromConvention, getConventionDayTimespans } from '../../TimespanUtils';

function EventListEvents({
  convention, eventsPaginated, sorted, canReadSchedule, fetchMoreIfNeeded,
}) {
  let previousConventionDay = null;
  let conventionDayTimespans = [];
  const conventionTimespan = timespanFromConvention(convention);
  if (conventionTimespan.isFinite()) {
    conventionDayTimespans = getConventionDayTimespans(
      conventionTimespan,
      convention.timezone_name,
    );
  }

  return eventsPaginated.entries.map((event, index) => {
    let preamble = null;
    if (sorted.some((sort) => sort.id === 'first_scheduled_run_start')) {
      const runs = getSortedRuns(event);
      if (runs.length > 0) {
        const conventionDay = conventionDayTimespans.find((timespan) => timespan.includesTime(
          moment.tz(runs[0].starts_at, convention.timezone_name),
        ));
        if (
          conventionDay
          && (previousConventionDay == null || !previousConventionDay.isSame(conventionDay))
        ) {
          preamble = (
            <h3 className="mt-4">
              {conventionDay.start.format('dddd, MMMM D')}
            </h3>
          );
          previousConventionDay = conventionDay;
        }
      }
    }

    const eventContent = (
      <React.Fragment key={event.id}>
        {preamble}
        <EventCard
          event={event}
          sorted={sorted}
          timezoneName={convention.timezone_name}
          canReadSchedule={canReadSchedule}
        />
      </React.Fragment>
    );

    if (index === eventsPaginated.entries.length - 5) {
      return (
        <Waypoint onEnter={fetchMoreIfNeeded} key={`waypoint-${event.id}`}>
          <div>
            {eventContent}
          </div>
        </Waypoint>
      );
    }

    return eventContent;
  });
}

EventListEvents.propTypes = {
  canReadSchedule: PropTypes.bool.isRequired,
  convention: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    ends_at: PropTypes.string.isRequired,
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  eventsPaginated: PropTypes.shape({
    entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
};

export default EventListEvents;
