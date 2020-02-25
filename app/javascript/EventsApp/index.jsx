import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
import eventIdRegexp from './eventIdRegexp';
import EventList from './EventList';
import EventPage from './EventPage';
import RunSignupSummary from './SignupAdmin/RunSignupSummary';
import ScheduleGridApp from './ScheduleGrid';
import SignupAdmin from './SignupAdmin';
import StandaloneEditEvent from './StandaloneEditEvent';
import TeamMemberAdmin from './TeamMemberAdmin';
import EventHistory from './EventPage/EventHistory';

function renderScheduleRoutes() {
  return [
    <Route
      path="/events/schedule"
      render={() => <ScheduleGridApp configKey="con_schedule" />}
      key="conSchedule"
    />,
    <Route
      path="/events/schedule_by_room"
      render={() => <ScheduleGridApp configKey="con_schedule_by_room" />}
      key="conScheduleByRoom"
    />,
    <Route
      path="/events/schedule_with_counts"
      render={() => <ScheduleGridApp configKey="schedule_with_counts" />}
      key="scheduleWithCounts"
    />,
  ];
}

function EventsApp() {
  const { siteMode } = useContext(AppRootContext);

  return (
    <Switch>
      {siteMode !== 'single_event' && renderScheduleRoutes()}
      <Route
        path={`/events/:eventId(${eventIdRegexp})`}
        render={({ match: { params: { eventId: eventIdSegment } } }) => {
          const eventId = Number.parseInt(eventIdSegment, 10);
          const eventPath = `/events/${eventIdSegment}`;

          return (
            <Switch>
              <Route
                path={`${eventPath}/edit`}
                render={() => (siteMode === 'single_event'
                  ? <Redirect to="/admin_events" />
                  : <StandaloneEditEvent eventId={eventId} eventPath={eventPath} />
                )}
              />
              <Route
                path={`${eventPath}/team_members`}
                render={() => <TeamMemberAdmin eventId={eventId} eventPath={eventPath} />}
              />
              <Route
                path={`${eventPath}/history`}
                render={() => <EventHistory eventId={eventId} eventPath={eventPath} />}
              />
              <Route
                path={`${eventPath}/runs/:runId`}
                render={({ match: { params: { runId: runIdSegment } } }) => {
                  const runId = Number.parseInt(runIdSegment, 10);
                  const runPath = `/events/${eventIdSegment}/runs/${runIdSegment}`;

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
                render={() => (
                  siteMode === 'single_event'
                    ? <Redirect to="/" />
                    : <EventPage eventId={eventId} eventPath={eventPath} />
                )}
              />
            </Switch>
          );
        }}
      />
      {siteMode !== 'single_event' && <Route path="/events"><EventList /></Route>}
    </Switch>
  );
}

export default EventsApp;
