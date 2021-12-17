import { useContext } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
import eventIdRegexp from './eventIdRegexp';
import EventList from './EventList';
import EventPage from './EventPage';
import RunSignupSummary from './SignupAdmin/RunSignupSummary';
import SignupAdmin from './SignupAdmin';
import StandaloneEditEvent from './StandaloneEditEvent';
import TeamMemberAdmin from './TeamMemberAdmin';
import EventHistory from './EventPage/EventHistory';
import ScheduleApp from './ScheduleApp';
import { parseIntOrNull } from '@neinteractiveliterature/litform/lib/ValueUtils';
import FourOhFourPage from '../FourOhFourPage';

type RunRoutesProps = {
  eventId: string;
  eventPath: string;
};

function RunRoutes({ eventId, eventPath }: RunRoutesProps) {
  const { runId } = useParams<{ runId: string }>();
  if (runId == null) {
    throw new Error('runId not found in URL params');
  }
  const runPath = `${eventPath}/runs/${runId}`;

  return (
    <Routes>
      <Route
        path={`${runPath}/admin_signups`}
        element={<SignupAdmin eventId={eventId} runId={runId} eventPath={eventPath} />}
      />
      <Route
        path={`${runPath}/signup_summary`}
        element={<RunSignupSummary eventId={eventId} runId={runId} eventPath={eventPath} />}
      />
    </Routes>
  );
}

function EventRoutes() {
  const { siteMode } = useContext(AppRootContext);
  const eventIdSegment = useParams<{ eventId: string }>().eventId;
  const eventId = parseIntOrNull(eventIdSegment ?? '')?.toString();
  const eventPath = `/events/${eventIdSegment}`;

  if (!eventId) {
    return <FourOhFourPage />;
  }

  return (
    <Routes>
      <Route
        path={`${eventPath}/edit`}
        element={
          siteMode === 'single_event' ? (
            <Navigate to="/admin_events" />
          ) : (
            <StandaloneEditEvent eventId={eventId} eventPath={eventPath} />
          )
        }
      />
      <Route path={`${eventPath}/team_members`} element={<TeamMemberAdmin eventId={eventId} eventPath={eventPath} />} />
      <Route path={`${eventPath}/history`} element={<EventHistory eventId={eventId} eventPath={eventPath} />} />
      <Route path={`${eventPath}/runs/:runId`} element={<RunRoutes eventId={eventId} eventPath={eventPath} />} />
      <Route
        path={eventPath}
        element={
          siteMode === 'single_event' ? <Navigate to="/" /> : <EventPage eventId={eventId} eventPath={eventPath} />
        }
      />
    </Routes>
  );
}

function EventsApp(): JSX.Element {
  const { siteMode } = useContext(AppRootContext);

  return (
    <Routes>
      {[
        ...(siteMode !== 'single_event'
          ? [
              <Route path="/events/schedule" key="schedule" element={<ScheduleApp />} />,
              <Route
                path="/events/schedule_by_room"
                key="scheduleByRoom"
                element={<Navigate to="/events/schedule" replace />}
              />,
              <Route
                path="/events/schedule_with_counts"
                key="scheduleWithCounts"
                element={<Navigate to="/events/schedule" replace />}
              />,
            ]
          : []),
        <Route key="specificEventRoutes" path={`/events/:eventId(${eventIdRegexp})`} element={<EventRoutes />} />,
        ...(siteMode !== 'single_event' ? [<Route key="eventList" path="/events" element={<EventList />} />] : []),
      ]}
    </Routes>
  );
}

export default EventsApp;
