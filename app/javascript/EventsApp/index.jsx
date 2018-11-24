import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import eventIdRegexp from './eventIdRegexp';
import EventList from './EventList';
import EventPage from './EventPage';
import RunSignupSummary from './SignupAdmin/RunSignupSummary';
import ScheduleGridApp from './ScheduleGrid';
import SignupAdmin from './SignupAdmin';
import StandaloneEditEvent from './StandaloneEditEvent';

function EventsApp({ basename }) {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route path="/schedule" render={() => <ScheduleGridApp configKey="con_schedule" />} />
        <Route
          path="/schedule_by_room"
          render={() => <ScheduleGridApp configKey="con_schedule_by_room" />}
        />
        <Route
          path="/schedule_with_counts"
          render={() => <ScheduleGridApp configKey="schedule_with_counts" />}
        />
        <Route
          path={`/:id(${eventIdRegexp})/edit`}
          render={({ match }) => (
            <StandaloneEditEvent eventId={Number.parseInt(match.params.id, 10)} />
          )}
        />
        <Route
          path={`/:eventId(${eventIdRegexp})/runs/:runId/admin_signups`}
          render={({ match }) => (
            <SignupAdmin
              eventId={Number.parseInt(match.params.eventId, 10)}
              runId={Number.parseInt(match.params.runId, 10)}
            />
          )}
        />
        <Route
          path={`/:eventId(${eventIdRegexp})/runs/:runId/signup_summary`}
          render={({ match }) => (
            <RunSignupSummary
              eventId={Number.parseInt(match.params.eventId, 10)}
              runId={Number.parseInt(match.params.runId, 10)}
            />
          )}
        />
        <Route
          path={`/:id(${eventIdRegexp})`}
          render={({ match }) => <EventPage eventId={Number.parseInt(match.params.id, 10)} />}
        />
        <Route path="/" render={() => <EventList />} />
      </Switch>
    </BrowserRouter>
  );
}

EventsApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default EventsApp;
