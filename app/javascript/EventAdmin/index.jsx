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

function NewEvent({ history }) {
  const { data, error } = useQuerySuspended(EventAdminEventsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <NewEventForm
      convention={data.convention}
      onExit={() => history.replace('/admin_events/runs')}
    />
  );
}

NewEvent.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const EventAdmin = () => (
  <>
    <h1 className="mb-4">Event scheduling</h1>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink className="nav-link" to="/admin_events/runs">Regular events</NavLink>
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
      <Route
        path="/admin_events/new"
        render={({ history }) => <NewEvent history={history} />}
      />
      <Redirect to="/admin_events/runs" />
    </Switch>
  </>
);

export default EventAdmin;
