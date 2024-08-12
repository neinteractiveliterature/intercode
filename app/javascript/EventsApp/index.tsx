import React, { useContext } from 'react';
import { RouteObject, replace, useNavigate } from 'react-router-dom';

import AppRootContext from '../AppRootContext';
import EventPage from './EventPage';
import RunSignupSummary from './SignupAdmin/RunSignupSummary';
import SignupAdmin from './SignupAdmin';
import StandaloneEditEvent from './StandaloneEditEvent';
import TeamMemberAdmin from './TeamMemberAdmin';
import EventHistory from './EventPage/EventHistory';
import ScheduleApp from './ScheduleApp';
import NewTeamMember from './TeamMemberAdmin/NewTeamMember';
import EditTeamMember from './TeamMemberAdmin/EditTeamMember';
import TeamMembersIndex from './TeamMemberAdmin/TeamMembersIndex';
import { SignupAutomationMode, SiteMode, TicketMode } from '../graphqlTypes.generated';
import EventTicketTypesWrapper from './EventTicketTypesWrapper';
import EventList from './EventCatalog/EventList';
import EventTable from './EventCatalog/EventTable';
import { AppRootContextRouteGuard } from '../AppRouter';
import { conventionDayLoader } from './conventionDayUrls';
import { eventSingleTicketTypeLoader, eventTicketTypesLoader } from '../TicketTypeAdmin/loaders';

const LazyMySignupQueue = React.lazy(() => import('./MySignupQueue'));

function EventPageGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/', { replace: true });
    return <></>;
  } else {
    return <EventPage />;
  }
}

function EditEventGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/admin_events', { replace: true });
    return <></>;
  } else {
    return <StandaloneEditEvent />;
  }
}

export const eventsRoutes: RouteObject[] = [
  {
    element: <AppRootContextRouteGuard guard={({ siteMode }) => siteMode !== SiteMode.SingleEvent} />,
    children: [
      {
        path: 'schedule/*',
        children: [
          { path: ':day', element: <ScheduleApp />, loader: conventionDayLoader },
          { path: '', loader: conventionDayLoader },
        ],
      },
      { path: 'schedule_by_room/*', loader: () => replace('../schedule') },
      { path: 'schedule_with_counts/*', loader: () => replace('../schedule') },
      { path: 'table', element: <EventTable /> },
      { path: '', element: <EventList /> },
    ],
  },
  {
    element: (
      <AppRootContextRouteGuard
        guard={({ signupAutomationMode }) => signupAutomationMode === SignupAutomationMode.RankedChoice}
      />
    ),
    children: [{ path: 'my-signup-queue', element: <LazyMySignupQueue /> }],
  },
  {
    path: ':eventId',
    children: [
      {
        element: <AppRootContextRouteGuard guard={({ ticketMode }) => ticketMode === TicketMode.TicketPerEvent} />,
        children: [
          {
            path: 'ticket_types/*',
            element: <EventTicketTypesWrapper />,
            loader: eventTicketTypesLoader,
            children: [
              { path: 'new', loader: eventTicketTypesLoader, lazy: () => import('../TicketTypeAdmin/NewTicketType') },
              {
                path: ':id/edit',
                loader: eventSingleTicketTypeLoader,
                lazy: () => import('../TicketTypeAdmin/EditTicketType'),
              },
              { index: true, loader: eventTicketTypesLoader, lazy: () => import('../TicketTypeAdmin/TicketTypesList') },
            ],
          },
        ],
      },
      { path: 'edit', element: <EditEventGuard /> },
      {
        path: 'team_members/*',
        element: <TeamMemberAdmin />,
        children: [
          { path: 'new', element: <NewTeamMember /> },
          { path: ':teamMemberId', element: <EditTeamMember /> },
          { path: '', element: <TeamMembersIndex /> },
        ],
      },
      { path: 'history/*', element: <EventHistory /> },
      {
        path: 'runs/:runId',
        children: [
          { path: 'admin_signups/*', element: <SignupAdmin /> },
          { path: 'signup_summary', element: <RunSignupSummary /> },
        ],
      },
      { path: '', element: <EventPageGuard /> },
    ],
  },
];
