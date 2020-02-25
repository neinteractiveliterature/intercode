import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link, useHistory } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';
import { getConventionDayTimespans, timespanFromConvention } from '../../TimespanUtils';

function findRunFromHash(runs, hash) {
  if (!hash) {
    return null;
  }

  return runs.find((run) => `#run-${run.id}` === hash);
}

function getConventionDayStart(event, run, convention) {
  const conventionTimespan = timespanFromConvention(convention);
  if (!run) {
    return conventionTimespan.start;
  }

  const runStart = moment.tz(run.starts_at, convention.timezone_name);
  const conventionDayTimespans = getConventionDayTimespans(
    conventionTimespan,
    convention.timezone_name,
  );
  const conventionDay = conventionDayTimespans.find((timespan) => timespan.includesTime(runStart));
  return (conventionDay || conventionTimespan).start;
}

function EventBreadcrumbItems({
  event, convention, currentAbility, eventPath,
}) {
  const history = useHistory();
  const runToLink = findRunFromHash(event.runs, history.location.hash) || event.runs[0];
  const conventionDayStart = getConventionDayStart(event, runToLink, convention);

  return (
    <>
      <li className="breadcrumb-item">
        {
          currentAbility.can_read_schedule && event.runs.length > 0
            ? (
              <Link
                to={
                  `/events/schedule/${conventionDayStart.format('dddd').toLowerCase()}`
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
      <BreadcrumbItemWithRoute
        path={eventPath}
        to={eventPath}
        exact
      >
        {event.title}
      </BreadcrumbItemWithRoute>
    </>
  );
}

EventBreadcrumbItems.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    runs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }).isRequired,
  currentAbility: PropTypes.shape({
    can_read_schedule: PropTypes.bool.isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventBreadcrumbItems;
