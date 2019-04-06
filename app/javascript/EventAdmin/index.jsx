import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, NavLink, Route, Switch, Redirect, withRouter,
} from 'react-router-dom';

import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import { EventAdminEventsQuery } from './queries.gql';
import EventAdminRunsTable from './EventAdminRunsTable';
import NewEventForm from './NewEventForm';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RecurringEventAdmin from './RecurringEventAdmin';
import SingleRunEventAdmin from './SingleRunEventAdmin';

function ExitableNewEvent({ convention, history }) {
  return (
    <NewEventForm
      convention={convention}
      onExit={() => history.replace('/runs')}
    />
  );
}

ExitableNewEvent.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

const ExitableNewEventWithRouter = withRouter(ExitableNewEvent);

const EventAdminApp = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink className="nav-link" to="/runs">Regular events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/recurring_events">Recurring events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/filler_events">Single-run events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dropped_events">Dropped events</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/runs" component={EventAdminRunsTable} />
        <Route path="/:eventId/runs" component={EventAdminRunsTable} />
        <Route path="/recurring_events" component={RecurringEventAdmin} />
        <Route path="/filler_events" component={SingleRunEventAdmin} />
        <Route path="/dropped_events" component={DroppedEventAdmin} />
        <Route path="/:id/edit" component={EventAdminEditEvent} />
        <Route
          path="/new"
          render={() => (
            <QueryWithStateDisplay query={EventAdminEventsQuery}>
              {({ data: { convention } }) => (
                <ExitableNewEventWithRouter convention={convention} />
              )}
            </QueryWithStateDisplay>
          )}
        />
        <Redirect to="/runs" />
      </Switch>
    </div>
  </BrowserRouter>
);

EventAdminApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventAdminApp;
