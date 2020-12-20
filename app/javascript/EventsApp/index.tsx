import { useContext } from 'react';
import { Switch, Route, Redirect, useParams } from 'react-router-dom';

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
import { NoLoginAuthorizationWrapper } from '../Authentication/useAuthorizationRequired';
import RunList from './RunList';

function renderScheduleRoutes() {
  return [
    <Route path="/events/schedule" key="conSchedule">
      <NoLoginAuthorizationWrapper abilities={['can_read_schedule']}>
        <ScheduleGridApp configKey="con_schedule" />
      </NoLoginAuthorizationWrapper>
    </Route>,
    <Route path="/events/schedule_by_room" key="conScheduleByRoom">
      <NoLoginAuthorizationWrapper abilities={['can_read_schedule']}>
        <ScheduleGridApp configKey="con_schedule_by_room" />
      </NoLoginAuthorizationWrapper>
    </Route>,
    <Route path="/events/schedule_with_counts" key="scheduleWithCounts">
      <NoLoginAuthorizationWrapper abilities={['can_read_schedule_with_counts']}>
        <ScheduleGridApp configKey="schedule_with_counts" />
      </NoLoginAuthorizationWrapper>
    </Route>,
    <Route path="/events/run_list" key="runList">
      <NoLoginAuthorizationWrapper abilities={['can_read_schedule']}>
        <RunList />
      </NoLoginAuthorizationWrapper>
    </Route>,
  ];
}

type RunRoutesProps = {
  eventId: number;
  eventPath: string;
};

function RunRoutes({ eventId, eventPath }: RunRoutesProps) {
  const runId = Number.parseInt(useParams<{ runId: string }>().runId, 10);
  const runPath = `${eventPath}/runs/${runId}`;

  return (
    <Switch>
      <Route path={`${runPath}/admin_signups`}>
        <SignupAdmin eventId={eventId} runId={runId} eventPath={eventPath} />
      </Route>
      <Route path={`${runPath}/signup_summary`}>
        <RunSignupSummary eventId={eventId} runId={runId} eventPath={eventPath} />
      </Route>
    </Switch>
  );
}

function EventRoutes() {
  const { siteMode } = useContext(AppRootContext);
  const eventIdSegment = useParams<{ eventId: string }>().eventId;
  const eventId = Number.parseInt(eventIdSegment, 10);
  const eventPath = `/events/${eventIdSegment}`;

  return (
    <Switch>
      <Route path={`${eventPath}/edit`}>
        {siteMode === 'single_event' ? (
          <Redirect to="/admin_events" />
        ) : (
          <StandaloneEditEvent eventId={eventId} eventPath={eventPath} />
        )}
      </Route>
      <Route path={`${eventPath}/team_members`}>
        <TeamMemberAdmin eventId={eventId} eventPath={eventPath} />
      </Route>
      <Route path={`${eventPath}/history`}>
        <EventHistory eventId={eventId} eventPath={eventPath} />
      </Route>
      <Route path={`${eventPath}/runs/:runId`}>
        <RunRoutes eventId={eventId} eventPath={eventPath} />
      </Route>
      <Route path={eventPath}>
        {siteMode === 'single_event' ? (
          <Redirect to="/" />
        ) : (
          <EventPage eventId={eventId} eventPath={eventPath} />
        )}
      </Route>
    </Switch>
  );
}

function EventsApp() {
  const { siteMode } = useContext(AppRootContext);

  return (
    <Switch>
      {siteMode !== 'single_event' && renderScheduleRoutes()}
      <Route path={`/events/:eventId(${eventIdRegexp})`}>
        <EventRoutes />
      </Route>
      {siteMode !== 'single_event' && (
        <Route path="/events">
          <EventList />
        </Route>
      )}
    </Switch>
  );
}

export default EventsApp;
