import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, NavLink, Route, Switch, Redirect } from 'react-router-dom';
import DroppedEventAdmin from './DroppedEventAdmin';
import EventAdminEditEvent from './EventAdminEditEvent';
import EventAdminRunsTable from './EventAdminRunsTable';
import FillerEventAdmin from './FillerEventAdmin';
import VolunteerEventAdmin from './VolunteerEventAdmin';

const EventAdminApp = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink className="nav-link" to="/runs">Regular events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/volunteer_events">Volunteer events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/filler_events">Filler events</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/dropped_events">Dropped events</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path="/runs" component={EventAdminRunsTable} />
        <Route path="/:eventId/runs" component={EventAdminRunsTable} />
        <Route path="/volunteer_events" component={VolunteerEventAdmin} />
        <Route path="/filler_events" component={FillerEventAdmin} />
        <Route path="/dropped_events" component={DroppedEventAdmin} />
        <Route path="/:id/edit" component={EventAdminEditEvent} />
        <Redirect to="/runs" />
      </Switch>
    </div>
  </BrowserRouter>
);

EventAdminApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventAdminApp;
