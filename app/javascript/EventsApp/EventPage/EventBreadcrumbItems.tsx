import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DateTime } from 'luxon';

import { getConventionDayTimespans, timespanFromConvention } from '../../TimespanUtils';
import RouteActivatedBreadcrumbItem from '../../Breadcrumbs/RouteActivatedBreadcrumbItem';
import AppRootContext from '../../AppRootContext';
import { EventPageRunFieldsFragment, EventPageEventFieldsFragment } from './queries.generated';
import { CommonConventionDataFragment } from '../queries.generated';

function findRunFromHash(runs: EventPageRunFieldsFragment[], hash: string) {
  if (!hash) {
    return undefined;
  }

  return runs.find((run) => `#run-${run.id}` === hash);
}

function getConventionDayStart(
  event: EventPageEventFieldsFragment,
  run: EventPageRunFieldsFragment,
  convention: CommonConventionDataFragment,
  timezoneName: string,
) {
  const conventionTimespan = timespanFromConvention(convention);
  if (!run) {
    return conventionTimespan.start;
  }

  const runStart = DateTime.fromISO(run.starts_at).setZone(timezoneName);
  const conventionDayTimespans = getConventionDayTimespans(
    conventionTimespan,
    timezoneName,
  );
  const conventionDay = conventionDayTimespans.find((timespan) => timespan.includesTime(runStart));
  return (conventionDay || conventionTimespan).start;
}

export type EventBreadcrumbItemsProps = {
  event: EventPageEventFieldsFragment,
  convention: CommonConventionDataFragment,
  currentAbility: {
    can_read_schedule: boolean,
  },
  eventPath: string,
};

function EventBreadcrumbItems({
  event, convention, currentAbility, eventPath,
}: EventBreadcrumbItemsProps) {
  const { timezoneName } = useContext(AppRootContext);
  const history = useHistory();
  const runToLink = findRunFromHash(event.runs, history.location.hash) || event.runs[0];
  const conventionDayStart = getConventionDayStart(event, runToLink, convention, timezoneName);

  return (
    <>
      <li className="breadcrumb-item">
        {
          currentAbility.can_read_schedule && event.runs.length > 0
            ? (
              <Link
                to={
                  conventionDayStart
                    ? `/events/schedule/${conventionDayStart.toFormat('EEEE').toLowerCase()}`
                    : '/events/schedule'
                }
              >
                Con schedule
              </Link>
            )
            : (
              <Link to="/events">
                List of events
              </Link>
            )
        }
      </li>
      <RouteActivatedBreadcrumbItem matchProps={{ path: eventPath, exact: true }} to={eventPath}>
        {event.title}
      </RouteActivatedBreadcrumbItem>
    </>
  );
}

export default EventBreadcrumbItems;
