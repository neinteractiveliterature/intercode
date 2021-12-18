import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
import EventList from './EventList';
import EventPage from './EventPage';
import RunSignupSummary from './SignupAdmin/RunSignupSummary';
import SignupAdmin from './SignupAdmin';
import StandaloneEditEvent from './StandaloneEditEvent';
import TeamMemberAdmin from './TeamMemberAdmin';
import EventHistory from './EventPage/EventHistory';
import ScheduleApp from './ScheduleApp';
import FourOhFourPage from '../FourOhFourPage';
import NewTeamMember from './TeamMemberAdmin/NewTeamMember';
import EditTeamMember from './TeamMemberAdmin/EditTeamMember';
import TeamMembersIndex from './TeamMemberAdmin/TeamMembersIndex';

function EventsApp(): JSX.Element {
  const { siteMode } = useContext(AppRootContext);

  return (
    <Routes>
      {[
        ...(siteMode !== 'single_event'
          ? [
              <Route path="schedule/*" key="schedule" element={<ScheduleApp />} />,
              <Route
                path="schedule_by_room/*"
                key="scheduleByRoom"
                element={<Navigate to="/events/schedule" replace />}
              />,
              <Route
                path="schedule_with_counts/*"
                key="scheduleWithCounts"
                element={<Navigate to="/events/schedule" replace />}
              />,
            ]
          : []),
        <Route key="specificEventRoutes" path=":eventId">
          <Route
            path="edit"
            element={siteMode === 'single_event' ? <Navigate to="/admin_events" /> : <StandaloneEditEvent />}
          />
          <Route path="team_members/*" element={<TeamMemberAdmin />}>
            <Route path="new" element={<NewTeamMember />} />
            <Route path=":teamMemberId" element={<EditTeamMember />} />
            <Route path="" element={<TeamMembersIndex />} />
          </Route>
          <Route path="history/*" element={<EventHistory />} />
          <Route path="runs/:runId">
            <Route path="admin_signups/*" element={<SignupAdmin />} />
            <Route path="signup_summary" element={<RunSignupSummary />} />
          </Route>
          <Route path="" element={siteMode === 'single_event' ? <Navigate to="/" /> : <EventPage />} />
        </Route>,
        ...(siteMode !== 'single_event' ? [<Route key="eventList" path="" element={<EventList />} />] : []),
        <Route key="404" path="*" element={<FourOhFourPage />} />,
      ]}
    </Routes>
  );
}

export default EventsApp;
