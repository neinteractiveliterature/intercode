import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../../Breadcrumbs/BreadcrumbItemWithRoute';

function EventBreadcrumbItems({
  event, convention, currentAbility, eventPath,
}) {
  return (
    <>
      <li className="breadcrumb-item">
        {
          currentAbility.can_read_schedule && event.runs.length > 0
            ? (
              <Link
                to={
                  `/schedule/${moment.tz(event.runs[0].starts_at, convention.timezone_name).format('dddd').toLowerCase()}`
                }
              >
                Con schedule
              </Link>
            )
            : (
              <Link to="/">
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
  }),
  convention: PropTypes.shape({
    timezone_name: PropTypes.string.isRequired,
  }),
  currentAbility: PropTypes.shape({
    can_read_schedule: PropTypes.bool.isRequired,
  }).isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventBreadcrumbItems;
