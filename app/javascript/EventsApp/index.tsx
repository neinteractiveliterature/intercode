import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
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
import { SignupMode, SiteMode, TicketMode } from '../graphqlTypes.generated';
import EventTicketTypesWrapper from './EventTicketTypesWrapper';
import EventList from './EventCatalog/EventList';
import EventTable from './EventCatalog/EventTable';

const LazyTicketTypeAdmin = React.lazy(() => import('../TicketTypeAdmin'));
const LazyMySignupQueue = React.lazy(() => import('./MySignupQueue'));

function EventsApp(): JSX.Element {
  const { siteMode, signupMode, ticketMode } = useContext(AppRootContext);

  return (
    <Routes>
      {siteMode !== SiteMode.SingleEvent && <Route path="schedule/*" element={<ScheduleApp />} />}
      {siteMode !== SiteMode.SingleEvent && (
        <Route path="schedule_by_room/*" element={<Navigate to="../schedule" replace />} />
      )}
      {siteMode !== SiteMode.SingleEvent && (
        <Route path="schedule_with_counts/*" element={<Navigate to="../schedule" replace />} />
      )}
      {siteMode !== SiteMode.SingleEvent && <Route path="table" element={<EventTable />} />}
      {signupMode === SignupMode.RankedChoice && <Route path="my-signup-queue" element={<LazyMySignupQueue />} />}
      <Route path=":eventId">
        <Route
          path="edit"
          element={siteMode === 'single_event' ? <Navigate to="/admin_events" /> : <StandaloneEditEvent />}
        />
        {ticketMode === TicketMode.TicketPerEvent && (
          <Route path="ticket_types/*" element={<EventTicketTypesWrapper />}>
            <Route path="*" element={<LazyTicketTypeAdmin />} />
          </Route>
        )}
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
      </Route>
      {siteMode !== SiteMode.SingleEvent && <Route path="" element={<EventList />} />}
      <Route path="*" element={<FourOhFourPage />} />
    </Routes>
  );
}

export default EventsApp;
