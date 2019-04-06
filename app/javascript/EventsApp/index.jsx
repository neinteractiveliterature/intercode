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
import TeamMemberAdmin from './TeamMemberAdmin';

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
          path={`/:eventId(${eventIdRegexp})`}
          render={({ match: { params: { eventId: eventIdSegment } } }) => {
            const eventId = Number.parseInt(eventIdSegment, 10);
            const eventPath = `/${eventIdSegment}`;

            return (
              <Switch>
                <Route
                  path={`${eventPath}/edit`}
                  render={() => <StandaloneEditEvent eventId={eventId} eventPath={eventPath} />}
                />
                <Route
                  path={`${eventPath}/team_members`}
                  render={() => <TeamMemberAdmin eventId={eventId} eventPath={eventPath} />}
                />
                <Route
                  path={`${eventPath}/runs/:runId`}
                  render={({ match: { params: { runId: runIdSegment } } }) => {
                    const runId = Number.parseInt(runIdSegment, 10);
                    const runPath = `/${eventIdSegment}/runs/${runIdSegment}`;

                    return (
                      <Switch>
                        <Route
                          path={`${runPath}/admin_signups`}
                          render={() => (
                            <SignupAdmin
                              eventId={eventId}
                              runId={runId}
                              eventPath={eventPath}
                            />
                          )}
                        />
                        <Route
                          path={`${runPath}/signup_summary`}
                          render={() => (
                            <RunSignupSummary
                              eventId={eventId}
                              runId={runId}
                              eventPath={eventPath}
                            />
                          )}
                        />
                      </Switch>
                    );
                  }}
                />

                <Route
                  path={eventPath}
                  render={() => <EventPage eventId={eventId} eventPath={eventPath} />}
                />
              </Switch>
            );
          }}
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
