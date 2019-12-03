import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';
import { Link } from 'react-router-dom';

import buildEventUrl from '../buildEventUrl';
import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQuery } from './queries.gql';
import useQuerySuspended from '../../useQuerySuspended';

function EventAdminMenu({ eventId }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { currentAbility, event } = data;
  const eventPath = buildEventUrl(event);

  if (!currentAbility.can_update_event) {
    return null;
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        Event Admin
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <Link to={`${eventPath}/edit`}>Edit event</Link>
        </li>
        <li className="list-group-item">
          <Link to={`${eventPath}/team_members`}>
            Edit
            {' '}
            {pluralize(event.event_category.team_member_name)}
          </Link>
        </li>
        <li className="list-group-item">
          <Link to={`${eventPath}/history`}>
            View edit history
          </Link>
        </li>
      </ul>
    </div>
  );
}

EventAdminMenu.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default EventAdminMenu;
