import React from 'react';
import PropTypes from 'prop-types';
import {
  NavLink, Route, Switch, Redirect,
} from 'react-router-dom';

import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import { EventAdminEventsQuery } from './queries.gql';
import EventAdminRunsTable from './EventAdminRunsTable';
import NewEventForm from './NewEventForm';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdmin from './SingleRunEventAdmin';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import usePageTitle from '../usePageTitle';

function NewEvent({ history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  usePageTitle('New Event');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4 mt-2">New event</h1>

      <NewEventForm
        convention={data.convention}
        onExit={() => history.replace('/admin_events/runs')}
      />
    </>
  );
}

NewEvent.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

function EventAdmin() {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (data.convention.site_mode === 'single_event') {
    if (data.events.length === 0) {
      return (
        <Switch>
          <Route path="/admin_events/new" component={NewEvent} />
          <Redirect to="/admin_events/new" />
        </Switch>
      );
    }

    return (
      <Switch>
        <Route path="/admin_events/:id/edit" component={EventAdminEditEvent} />
        <Redirect to={`/admin_events/${data.events[0].id}/edit`} />
      </Switch>
    );
  }

  return (
    <>
      <h1 className="mb-4">Event scheduling</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/admin_events/runs"
            isActive={(match, location) => (
              location.pathname === '/admin_events/runs' || location.pathname === '/admin_events/new'
            )}
          >
            Regular events
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_events/recurring_events">Recurring events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_events/filler_events">Single-run events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin_events/dropped_events">Dropped events</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/admin_events/runs" component={EventAdminRunsTable} />
        <Route path="/admin_events/:eventId/runs" component={EventAdminRunsTable} />
        <Route path="/admin_events/recurring_events" component={RecurringEventAdmin} />
        <Route path="/admin_events/filler_events" component={SingleRunEventAdmin} />
        <Route path="/admin_events/dropped_events" component={DroppedEventAdmin} />
        <Route path="/admin_events/:id/edit" component={EventAdminEditEvent} />
        <Route path="/admin_events/new" component={NewEvent} />
        <Redirect to="/admin_events/runs" />
      </Switch>
    </>
  );
}

export default EventAdmin;
