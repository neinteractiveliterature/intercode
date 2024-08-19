import { useState, Suspense, useEffect, ReactNode, useContext } from 'react';
import {
  useLocation,
  RouteObject,
  replace,
  Outlet,
  LoaderFunction,
  redirect,
  useNavigation,
  useNavigate,
} from 'react-router-dom';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import FourOhFourPage from './FourOhFourPage';
import { SignupAutomationMode, SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import useAuthorizationRequired, { AbilityName } from './Authentication/useAuthorizationRequired';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './EventAdmin/queries.generated';
import { client, preloadQuery } from './useIntercodeApolloClient';
import buildEventCategoryUrl from './EventAdmin/buildEventCategoryUrl';
import {
  adminSingleTicketTypeLoader,
  adminTicketTypesLoader,
  eventSingleTicketTypeLoader,
  eventTicketTypesLoader,
} from './TicketTypeAdmin/loaders';
import { organizationsLoader, singleOrganizationLoader } from './OrganizationAdmin/loaders';
import useLoginRequired from './Authentication/useLoginRequired';
import { eventProposalWithOwnerLoader } from './EventProposals/loaders';
import { conventionDayLoader } from './EventsApp/conventionDayUrls';
import { signupAdminEventLoader } from './EventsApp/SignupAdmin/loaders';
import { teamMembersLoader } from './EventsApp/TeamMemberAdmin/loader';
import { cmsAdminBaseQueryLoader } from './CmsAdmin/loaders';
import { cmsPagesAdminLoader } from './CmsAdmin/CmsPagesAdmin/loaders';
import { cmsPartialsAdminLoader } from './CmsAdmin/CmsPartialsAdmin/loaders';
import AppRoot, { AppRootLayoutContent } from './AppRoot';
import { AppRootQueryData, AppRootQueryDocument, AppRootQueryVariables } from './appRootQueries.generated';
import { liquidDocsLoader } from './LiquidDocs/loader';
import { cmsLayoutsAdminLoader } from './CmsAdmin/CmsLayoutsAdmin/loaders';
import { cmsGraphqlQueriesAdminLoader } from './CmsAdmin/CmsGraphqlQueriesAdmin/loaders';
import { cmsContentGroupsAdminLoader } from './CmsAdmin/CmsContentGroupsAdmin/loaders';
import { departmentAdminLoader } from './DepartmentAdmin/loaders';
import { eventCategoryAdminLoader } from './EventCategoryAdmin/loaders';

export enum NamedRoute {
  AdminEditEventProposal = 'AdminEditEventProposal',
  AdminEventProposal = 'AdminEventProposal',
  AdminForms = 'AdminForms',
  AdminUserConProfile = 'AdminUserConProfile',
  CmsAdmin = 'CmsAdmin',
  CmsContentGroupsAdmin = 'CmsContentGroupsAdmin',
  CmsGraphqlQueriesAdmin = 'CmsGraphqlQueriesAdmin',
  CmsLayoutsAdmin = 'CmsLayoutsAdmin',
  CmsPagesAdmin = 'CmsPagesAdmin',
  CmsPartialsAdmin = 'CmsPartialsAdmin',
  DepartmentAdmin = 'DepartmentAdmin',
  EditEventCategory = 'EditEventCategory',
  EditOrganizationRole = 'EditOrganizationRole',
  EditSignup = 'EditSignup',
  EditStaffPosition = 'EditStaffPosition',
  EditStaffPositionPermissions = 'EditStaffPositionPermissions',
  EditTeamMember = 'EditTeamMember',
  EditUserActivityAlert = 'EditUserActivityAlert',
  Event = 'Event',
  EventCategoryAdmin = 'EventCategoryAdmin',
  EventCategoryIndex = 'EventCategoryIndex',
  EventPage = 'EventPage',
  EventProposalAdminDisplay = 'EventProposalAdminDisplay',
  EventProposalHistory = 'EventProposalHistory',
  EventProposalHistoryChangeGroup = 'EventProposalHistoryChangeGroup',
  FormAdminIndex = 'FormAdminIndex',
  FormJSONEditor = 'FormJSONEditor',
  LiquidDocs = 'LiquidDocs',
  NewEventCategory = 'NewEventCategory',
  NewOrganizationRole = 'NewOrganizationRole',
  NewTeamMember = 'NewTeamMember',
  Organization = 'Organization',
  OrganizationAdmin = 'OrganizationAdmin',
  OrganizationDisplay = 'OrganizationDisplay',
  RootSiteConventionDisplay = 'RootSiteConventionDisplay',
  RunEmailList = 'RunEmailList',
  RunSignupChangesTable = 'RunSignupChangesTable',
  RunSignupsTable = 'RunSignupsTable',
  RunSignupSummary = 'RunSignupSummary',
  SignupAdmin = 'SignupAdmin',
  TeamMembers = 'TeamMembers',
  TeamMembersIndex = 'TeamMembersIndex',
  UserActivityAlerts = 'UserActivityAlerts',
}

export type RouteName = keyof typeof NamedRoute & string;

export type AppRootContextRouteGuardProps = {
  guard: (context: AppRootContextValue) => boolean;
};

export function AppRootContextRouteGuard({ guard }: AppRootContextRouteGuardProps) {
  const context = useContext(AppRootContext);

  if (guard(context)) {
    return <Outlet />;
  } else {
    return <FourOhFourPage />;
  }
}

function LoginRequiredRouteGuard() {
  const loginRequired = useLoginRequired();
  if (loginRequired) {
    return <></>;
  }

  return <Outlet />;
}

type AuthorizationRequiredRouteGuardProps = {
  abilities: AbilityName[];
};

function AuthorizationRequiredRouteGuard({ abilities }: AuthorizationRequiredRouteGuardProps) {
  const authorizationWarning = useAuthorizationRequired(...abilities);

  if (authorizationWarning) return authorizationWarning;

  return <Outlet />;
}

const eventAdminRootRedirect: LoaderFunction = async () => {
  const { data } = await client.query<EventAdminEventsQueryData>({ query: EventAdminEventsQueryDocument });
  if (!data.convention) {
    return new Response(null, { status: 404 });
  }

  if (data.convention.site_mode === SiteMode.SingleEvent) {
    if (data.convention.events.length === 0) {
      return redirect('./new');
    } else {
      return redirect(`./${data.convention.events[0].id}/edit`);
    }
  }

  const firstEventCategory = data.convention.event_categories[0];
  if (!firstEventCategory) {
    return new Response(null, { status: 404 });
  }

  return redirect(buildEventCategoryUrl(firstEventCategory));
};

function EventPageGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/', { replace: true });
    return <></>;
  } else {
    return <Outlet />;
  }
}

function EditEventGuard() {
  const { siteMode } = useContext(AppRootContext);
  const navigate = useNavigate();

  if (siteMode === SiteMode.SingleEvent) {
    navigate('/admin_events', { replace: true });
    return <></>;
  } else {
    return <LoginRequiredRouteGuard />;
  }
}

const eventsRoutes: RouteObject[] = [
  {
    element: <AppRootContextRouteGuard guard={({ siteMode }) => siteMode !== SiteMode.SingleEvent} />,
    children: [
      {
        path: 'schedule',
        children: [
          { path: ':day', lazy: () => import('./EventsApp/ScheduleApp') },
          { index: true, loader: conventionDayLoader },
        ],
      },
      { path: 'schedule_by_room/*', loader: () => replace('../schedule') },
      { path: 'schedule_with_counts/*', loader: () => replace('../schedule') },
      { path: 'table', lazy: () => import('./EventsApp/EventCatalog/EventTable') },
      { index: true, lazy: () => import('./EventsApp/EventCatalog/EventList') },
    ],
  },
  {
    element: (
      <AppRootContextRouteGuard
        guard={({ signupAutomationMode }) => signupAutomationMode === SignupAutomationMode.RankedChoice}
      />
    ),
    children: [{ path: 'my-signup-queue', lazy: () => import('./EventsApp/MySignupQueue') }],
  },
  {
    path: ':eventId',
    id: NamedRoute.Event,
    children: [
      {
        element: <AppRootContextRouteGuard guard={({ ticketMode }) => ticketMode === TicketMode.TicketPerEvent} />,
        children: [
          {
            path: 'ticket_types',
            loader: eventTicketTypesLoader,
            lazy: () => import('./EventsApp/EventTicketTypesWrapper'),
            children: [
              { path: 'new', loader: eventTicketTypesLoader, lazy: () => import('./TicketTypeAdmin/NewTicketType') },
              {
                path: ':id/edit',
                loader: eventSingleTicketTypeLoader,
                lazy: () => import('./TicketTypeAdmin/EditTicketType'),
              },
              { index: true, loader: eventTicketTypesLoader, lazy: () => import('./TicketTypeAdmin/TicketTypesList') },
            ],
          },
        ],
      },
      {
        path: 'edit',
        element: <EditEventGuard />,
        children: [
          {
            index: true,
            lazy: () => import('./EventsApp/StandaloneEditEvent'),
          },
        ],
      },
      {
        path: 'team_members',
        id: NamedRoute.TeamMembers,
        loader: teamMembersLoader,
        lazy: () => import('./EventsApp/TeamMemberAdmin'),
        children: [
          {
            path: 'new',
            id: NamedRoute.NewTeamMember,
            lazy: () => import('./EventsApp/TeamMemberAdmin/NewTeamMember'),
          },
          {
            path: ':teamMemberId',
            id: NamedRoute.EditTeamMember,
            lazy: () => import('./EventsApp/TeamMemberAdmin/EditTeamMember'),
          },
          {
            index: true,
            id: NamedRoute.TeamMembersIndex,
            lazy: () => import('./EventsApp/TeamMemberAdmin/TeamMembersIndex'),
          },
        ],
      },
      {
        path: 'history',
        lazy: () => import('./EventsApp/EventPage/EventHistory'),
        children: [{ path: ':changeGroupId', lazy: () => import('./EventsApp/EventPage/EventHistory') }],
      },
      {
        path: 'runs/:runId',
        lazy: () => import('./EventsApp/SignupAdmin/RunHeader'),
        children: [
          {
            path: 'admin_signups',
            loader: signupAdminEventLoader,
            id: NamedRoute.SignupAdmin,
            children: [
              { path: ':id/edit', id: NamedRoute.EditSignup, lazy: () => import('./EventsApp/SignupAdmin/EditSignup') },
              {
                lazy: () => import('./EventsApp/SignupAdmin/SignupsIndex'),
                children: [
                  {
                    path: 'emails/:separator',
                    id: NamedRoute.RunEmailList,
                    lazy: () => import('./EventsApp/SignupAdmin/RunEmailList'),
                  },
                  {
                    path: 'signup_changes',
                    id: NamedRoute.RunSignupChangesTable,
                    lazy: () => import('./EventsApp/SignupAdmin/RunSignupChangesTable'),
                  },
                  {
                    index: true,
                    id: NamedRoute.RunSignupsTable,
                    lazy: () => import('./EventsApp/SignupAdmin/RunSignupsTable'),
                  },
                ],
              },
            ],
          },
          {
            path: 'signup_summary',
            id: NamedRoute.RunSignupSummary,
            lazy: () => import('./EventsApp/SignupAdmin/RunSignupSummary'),
          },
        ],
      },
      {
        path: '',
        element: <EventPageGuard />,
        children: [{ index: true, id: NamedRoute.EventPage, lazy: () => import('./EventsApp/EventPage') }],
      },
    ],
  },
];

function NonCMSPageWrapper() {
  return (
    <div className="non-cms-page">
      <Outlet />
    </div>
  );
}

const cmsPageRoutes: RouteObject[] = [
  { path: '/pages/*', lazy: () => import('./CmsPage') },
  { index: true, lazy: () => import('./CmsPage') },
];

const commonRoutes: RouteObject[] = [
  {
    lazy: () => import('./CmsAdmin'),
    loader: cmsAdminBaseQueryLoader,
    id: NamedRoute.CmsAdmin,
    children: [
      {
        path: '/cms_pages',
        loader: cmsPagesAdminLoader,
        id: NamedRoute.CmsPagesAdmin,
        children: [
          { path: ':id/edit', lazy: () => import('./CmsAdmin/CmsPagesAdmin/EditCmsPage') },
          { path: ':id/view_source', lazy: () => import('./CmsAdmin/CmsPagesAdmin/ViewCmsPageSource') },
          { path: 'new', lazy: () => import('./CmsAdmin/CmsPagesAdmin/NewCmsPage') },
          { index: true, lazy: () => import('./CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable') },
        ],
      },
      {
        path: '/cms_partials',
        loader: cmsPartialsAdminLoader,
        id: NamedRoute.CmsPartialsAdmin,
        children: [
          { path: ':id/edit', lazy: () => import('./CmsAdmin/CmsPartialsAdmin/EditCmsPartial') },
          { path: ':id/view_source', lazy: () => import('./CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource') },
          { path: 'new', lazy: () => import('./CmsAdmin/CmsPartialsAdmin/NewCmsPartial') },
          { index: true, lazy: () => import('./CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable') },
        ],
      },
      { path: '/cms_files', lazy: () => import('./CmsAdmin/CmsFilesAdmin') },
      { path: '/cms_navigation_items', lazy: () => import('./CmsAdmin/NavigationItemsAdmin') },
      {
        path: '/cms_layouts',
        loader: cmsLayoutsAdminLoader,
        id: NamedRoute.CmsLayoutsAdmin,
        children: [
          { path: ':id/edit', lazy: () => import('./CmsAdmin/CmsLayoutsAdmin/EditCmsLayout') },
          { path: ':id/view_source', lazy: () => import('./CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource') },
          { path: 'new', lazy: () => import('./CmsAdmin/CmsLayoutsAdmin/NewCmsLayout') },
          { index: true, lazy: () => import('./CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable') },
        ],
      },
      { path: '/cms_variables', lazy: () => import('./CmsAdmin/CmsVariablesAdmin') },
      {
        path: '/cms_graphql_queries',
        loader: cmsGraphqlQueriesAdminLoader,
        id: NamedRoute.CmsGraphqlQueriesAdmin,
        children: [
          { path: ':id/edit', lazy: () => import('./CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery') },
          {
            path: ':id/view_source',
            lazy: () => import('./CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource'),
          },
          { path: 'new', lazy: () => import('./CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery') },
          { index: true, lazy: () => import('./CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable') },
        ],
      },
      {
        path: '/cms_content_groups',
        loader: cmsContentGroupsAdminLoader,
        id: NamedRoute.CmsContentGroupsAdmin,
        children: [
          { path: ':id/edit', lazy: () => import('./CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup') },
          { path: 'new', lazy: () => import('./CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup') },
          { path: ':id', lazy: () => import('./CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup') },
          { index: true, lazy: () => import('./CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable') },
        ],
      },
      {
        element: <AppRootContextRouteGuard guard={({ conventionName }) => conventionName == null} />,
        children: [{ path: '/root_site', lazy: () => import('./RootSiteAdmin/EditRootSite') }],
      },
    ],
  },
  { path: '/oauth/applications-embed', lazy: () => import('./OAuthApplications') },
  { path: '/oauth/authorize', lazy: () => import('./OAuth/AuthorizationPrompt') },
  { path: '/oauth/authorized_applications', lazy: () => import('./OAuth/AuthorizedApplications') },
  { path: '/users/edit', lazy: () => import('./Authentication/EditUser') },
  { path: '/users/password/edit', lazy: () => import('./Authentication/ResetPassword') },
];

const commonInConventionRoutes: RouteObject[] = [
  {
    path: '/admin_departments',
    element: <AuthorizationRequiredRouteGuard abilities={['can_update_departments']} />,
    id: NamedRoute.DepartmentAdmin,
    loader: departmentAdminLoader,
    children: [
      { path: ':id/edit', lazy: () => import('./DepartmentAdmin/EditDepartment') },
      { path: 'new', lazy: () => import('./DepartmentAdmin/NewDepartment') },
      { index: true, lazy: () => import('./DepartmentAdmin/DepartmentAdminIndex') },
    ],
  },
  {
    path: '/admin_events',
    lazy: () => import('./EventAdmin'),
    children: [
      {
        element: <AppRootContextRouteGuard guard={({ siteMode }) => siteMode !== SiteMode.SingleEvent} />,
        children: [
          { path: ':eventCategoryId/new', lazy: () => import('./EventAdmin/NewEvent') },
          { path: 'dropped_events', lazy: () => import('./EventAdmin/DroppedEventAdmin') },
          {
            path: ':eventCategoryId',
            lazy: () => import('./EventAdmin/CategorySpecificEventAdmin'),
            children: [
              { path: ':eventId/runs/:runId/edit', lazy: () => import('./EventAdmin/EditRun') },
              { path: ':eventId/runs/new', lazy: () => import('./EventAdmin/EditRun') },
            ],
          },
        ],
      },
      { path: ':id/edit', lazy: () => import('./EventAdmin/EventAdminEditEvent') },
      { index: true, loader: eventAdminRootRedirect },
    ],
  },
  {
    path: '/admin_forms',
    id: NamedRoute.AdminForms,
    lazy: () => import('./FormAdmin'),
    children: [
      { path: ':id/edit_advanced', id: NamedRoute.FormJSONEditor, lazy: () => import('./FormAdmin/FormJSONEditor') },
      { index: true, id: NamedRoute.FormAdminIndex, lazy: () => import('./FormAdmin/FormAdminIndex') },
    ],
  },
  {
    path: '/admin_notifications',
    element: <AuthorizationRequiredRouteGuard abilities={['can_update_notification_templates']} />,
    children: [
      { path: ':category/:event', lazy: () => import('./NotificationAdmin/NotificationConfiguration') },
      { index: true, lazy: () => import('./NotificationAdmin/NotificationAdminIndex') },
    ],
  },
  {
    path: '/admin_store',
    lazy: () => import('./Store/StoreAdmin'),
    children: [
      { path: 'products', lazy: () => import('./Store/ProductAdmin') },
      { path: 'coupons', lazy: () => import('./Store/CouponAdmin/CouponAdminTable') },
      { path: 'orders', lazy: () => import('./Store/OrderAdmin') },
      { path: 'order_summary', lazy: () => import('./Store/OrderSummary') },
      { index: true, loader: () => redirect('./products') },
    ],
  },
  { path: '/cart', lazy: () => import('./Store/Cart') },
  { path: '/clickwrap_agreement', lazy: () => import('./ClickwrapAgreement') },
  { path: '/convention/edit', lazy: () => import('./ConventionAdmin') },
  { path: '/events', children: eventsRoutes },
  {
    path: '/mailing_lists',
    element: <AuthorizationRequiredRouteGuard abilities={['can_read_any_mailing_list']} />,
    children: [
      { path: 'ticketed_attendees', lazy: () => import('./MailingLists/TicketedAttendees') },
      { path: 'event_proposers', lazy: () => import('./MailingLists/EventProposers') },
      { path: 'team_members', lazy: () => import('./MailingLists/TeamMembers') },
      { path: 'users_with_pending_bio', lazy: () => import('./MailingLists/UsersWithPendingBio') },
      { path: 'waitlists', lazy: () => import('./MailingLists/WaitlistMailingLists') },
      { path: 'whos_free', lazy: () => import('./MailingLists/WhosFree') },
      { index: true, lazy: () => import('./MailingLists') },
    ],
  },
  {
    path: '/my_profile',
    element: <LoginRequiredRouteGuard />,
    children: [
      { path: 'edit_bio', loader: () => replace('./edit') },
      { path: 'edit', lazy: () => import('./MyProfile/MyProfileForm') },
      { path: 'setup', lazy: () => import('./MyProfile/MyProfileForm') },
      { index: true, lazy: () => import('./MyProfile/MyProfileDisplay') },
    ],
  },
  { path: '/order_history', lazy: () => import('./Store/OrderHistory') },
  { path: '/products/:id', lazy: () => import('./Store/ProductPage') },
  {
    path: '/reports',
    element: <AuthorizationRequiredRouteGuard abilities={['can_read_reports']} />,
    children: [
      { path: 'attendance_by_payment_amount', lazy: () => import('./Reports/AttendanceByPaymentAmount') },
      { path: 'event_provided_tickets', lazy: () => import('./Reports/EventProvidedTickets') },
      { path: 'events_by_choice', lazy: () => import('./Reports/EventsByChoice') },
      { path: 'signup_spy', lazy: () => import('./Reports/SignupSpy') },
      { index: true, lazy: () => import('./Reports') },
    ],
  },
  { path: '/rooms', lazy: () => import('./RoomsAdmin') },
  {
    element: <AppRootContextRouteGuard guard={({ signupMode }) => signupMode === SignupMode.Moderated} />,
    children: [
      {
        path: '/signup_moderation',
        lazy: () => import('./SignupModeration'),
        children: [
          {
            element: (
              <AppRootContextRouteGuard
                guard={({ signupAutomationMode }) => signupAutomationMode === SignupAutomationMode.RankedChoice}
              />
            ),
            children: [
              {
                path: 'ranked_choice_queue',
                lazy: () => import('./SignupModeration/RankedChoiceQueue'),
                children: [
                  { path: ':userConProfileId', lazy: () => import('./SignupModeration/UserRankedChoiceQueue') },
                ],
              },
            ],
          },
          { path: 'queue', lazy: () => import('./SignupModeration/SignupModerationQueue') },
          { path: 'create_signups', lazy: () => import('./SignupModeration/CreateSignup') },
          { index: true, loader: () => redirect('./queue') },
        ],
      },
    ],
  },
  {
    path: '/signup_rounds',
    lazy: () => import('./SignupRoundsAdmin'),
    children: [
      { path: ':id/results', lazy: () => import('./SignupRoundsAdmin/RankedChoiceSignupDecisionsPage') },
      { index: true, lazy: () => import('./SignupRoundsAdmin/SignupRoundsAdminPage') },
    ],
  },
  {
    path: '/staff_positions',
    lazy: () => import('./StaffPositionAdmin'),
    children: [
      { path: 'new', lazy: () => import('./StaffPositionAdmin/NewStaffPosition') },
      {
        path: ':id',
        children: [
          {
            path: 'edit',
            id: NamedRoute.EditStaffPosition,
            lazy: () => import('./StaffPositionAdmin/EditStaffPosition'),
          },
          {
            path: 'edit_permissions',
            id: NamedRoute.EditStaffPositionPermissions,
            lazy: () => import('./StaffPositionAdmin/EditStaffPositionPermissions'),
          },
        ],
      },
      { index: true, lazy: () => import('./StaffPositionAdmin/StaffPositionsTable') },
    ],
  },
  {
    path: '/ticket',
    children: [
      { path: 'new', lazy: () => import('./MyTicket/TicketPurchasePage') },
      { index: true, lazy: () => import('./MyTicket/MyTicketDisplay') },
    ],
  },
  {
    element: <AppRootContextRouteGuard guard={({ ticketMode }) => ticketMode === TicketMode.RequiredForSignup} />,
    children: [
      {
        path: '/ticket_types',
        element: <AuthorizationRequiredRouteGuard abilities={['can_manage_ticket_types']} />,
        children: [
          { path: 'new', loader: adminTicketTypesLoader, lazy: () => import('./TicketTypeAdmin/NewTicketType') },
          {
            path: ':id/edit',
            loader: adminSingleTicketTypeLoader,
            lazy: () => import('./TicketTypeAdmin/EditTicketType'),
          },
          { index: true, loader: adminTicketTypesLoader, lazy: () => import('./TicketTypeAdmin/TicketTypesList') },
        ],
      },
    ],
  },
  {
    path: '/user_activity_alerts',
    id: NamedRoute.UserActivityAlerts,
    lazy: () => import('./UserActivityAlerts/UserActivityAlertsAdmin'),
    children: [
      { path: 'new', lazy: () => import('./UserActivityAlerts/NewUserActivityAlert') },
      {
        path: ':id/edit',
        id: NamedRoute.EditUserActivityAlert,
        lazy: () => import('./UserActivityAlerts/EditUserActivityAlert'),
      },
      { index: true, lazy: () => import('./UserActivityAlerts/UserActivityAlertsList') },
    ],
  },
  {
    path: '/user_con_profiles',
    element: <AuthorizationRequiredRouteGuard abilities={['can_read_user_con_profiles']} />,
    children: [
      { path: 'new', lazy: () => import('./UserConProfiles/AttendeesPage') },
      {
        path: ':id',
        id: NamedRoute.AdminUserConProfile,
        lazy: () => import('./UserConProfiles/userConProfileLoader'),
        children: [
          {
            path: 'admin_ticket',
            children: [
              { path: 'new', lazy: () => import('./UserConProfiles/NewTicket') },
              { path: 'edit', lazy: () => import('./UserConProfiles/EditTicket') },
            ],
          },
          { path: 'edit', lazy: () => import('./UserConProfiles/EditUserConProfile') },
          { index: true, lazy: () => import('./UserConProfiles/UserConProfileAdminDisplay') },
        ],
      },
      { index: true, lazy: () => import('./UserConProfiles/AttendeesPage') },
    ],
  },
];

const conventionModeRoutes: RouteObject[] = [
  {
    path: '/admin_event_proposals',
    lazy: () => import('./EventProposals/EventProposalsAdmin'),
    children: [
      {
        path: ':id',
        id: NamedRoute.AdminEventProposal,
        loader: eventProposalWithOwnerLoader,
        children: [
          {
            path: 'history',
            id: NamedRoute.EventProposalHistory,
            lazy: () => import('./EventProposals/EventProposalHistory'),
            children: [
              {
                path: ':changeGroupId',
                id: NamedRoute.EventProposalHistoryChangeGroup,
                lazy: () => import('./EventProposals/EventProposalHistory'),
              },
            ],
          },
          {
            path: 'edit',
            id: NamedRoute.AdminEditEventProposal,
            lazy: () => import('./EventProposals/AdminEditEventProposal'),
          },
          {
            index: true,
            id: NamedRoute.EventProposalAdminDisplay,
            lazy: () => import('./EventProposals/EventProposalAdminDisplay'),
          },
        ],
      },
      { index: true, lazy: () => import('./EventProposals/EventProposalsAdminTable') },
    ],
  },
  {
    element: <AuthorizationRequiredRouteGuard abilities={['can_update_event_categories']} />,
    children: [
      {
        path: '/event_categories',
        lazy: () => import('./EventCategoryAdmin'),
        id: NamedRoute.EventCategoryAdmin,
        loader: eventCategoryAdminLoader,
        children: [
          { path: 'new', id: NamedRoute.NewEventCategory, lazy: () => import('./EventCategoryAdmin/NewEventCategory') },
          {
            path: ':id/edit',
            id: NamedRoute.EditEventCategory,
            lazy: () => import('./EventCategoryAdmin/EditEventCategory'),
          },
          {
            index: true,
            id: NamedRoute.EventCategoryIndex,
            lazy: () => import('./EventCategoryAdmin/EventCategoryIndex'),
          },
        ],
      },
    ],
  },
  { path: '/event_proposals/:id/edit', lazy: () => import('./EventProposals/EditEventProposal') },
  { path: '/event_proposals', loader: () => replace('/pages/new-proposal') },
];

const singleEventModeRoutes: RouteObject[] = [];

const rootSiteRoutes: RouteObject[] = [
  {
    path: '/conventions',
    lazy: () => import('./RootSiteConventionsAdmin'),
    children: [
      {
        path: ':id',
        id: NamedRoute.RootSiteConventionDisplay,
        lazy: () => import('./RootSiteConventionsAdmin/ConventionDisplay'),
      },
      { index: true, lazy: () => import('./RootSiteConventionsAdmin/RootSiteConventionsAdminTable') },
    ],
  },
  { path: '/email_routes', lazy: () => import('./RootSiteEmailRoutesAdmin') },
  {
    path: '/organizations',
    id: NamedRoute.OrganizationAdmin,
    loader: organizationsLoader,
    lazy: () => import('./OrganizationAdmin'),
    children: [
      {
        path: ':id',
        loader: singleOrganizationLoader,
        id: NamedRoute.Organization,
        children: [
          {
            path: 'roles/new',
            id: NamedRoute.NewOrganizationRole,
            lazy: () => import('./OrganizationAdmin/NewOrganizationRole'),
          },
          {
            path: 'roles/:organizationRoleId/edit',
            id: NamedRoute.EditOrganizationRole,
            lazy: () => import('./OrganizationAdmin/EditOrganizationRole'),
          },
          {
            index: true,
            id: NamedRoute.OrganizationDisplay,
            lazy: () => import('./OrganizationAdmin/OrganizationDisplay'),
          },
        ],
      },
      { index: true, lazy: () => import('./OrganizationAdmin/OrganizationIndex') },
    ],
  },
  {
    path: '/users',
    lazy: () => import('./Users/UsersAdmin'),
    children: [
      { path: ':id', lazy: () => import('./Users/UserAdminDisplay') },
      { index: true, lazy: () => import('./Users/UsersTable') },
    ],
  },
];

export const appLayoutRoutes: RouteObject[] = [
  {
    element: <NonCMSPageWrapper />,
    children: [
      {
        element: (
          <AppRootContextRouteGuard
            guard={({ conventionName, siteMode }) => conventionName != null && siteMode !== SiteMode.SingleEvent}
          />
        ),
        children: conventionModeRoutes,
      },
      {
        element: (
          <AppRootContextRouteGuard
            guard={({ conventionName, siteMode }) => conventionName != null && siteMode === SiteMode.SingleEvent}
          />
        ),
        children: singleEventModeRoutes,
      },
      {
        element: <AppRootContextRouteGuard guard={({ conventionName }) => conventionName != null} />,
        children: commonInConventionRoutes,
      },
      {
        element: <AppRootContextRouteGuard guard={({ conventionName }) => conventionName == null} />,
        children: rootSiteRoutes,
      },
      ...commonRoutes,
    ],
  },
  ...cmsPageRoutes,
  { path: '*', element: <FourOhFourPage /> },
];

export const appRootRoutes: RouteObject[] = [
  {
    element: <AppRoot />,
    loader: () => preloadQuery<AppRootQueryData, AppRootQueryVariables>(AppRootQueryDocument),
    children: [
      {
        path: '/admin_forms/:id/edit',
        lazy: () => import('./FormAdmin/FormEditor'),
        children: [
          { path: 'section/:sectionId/item/:itemId', lazy: () => import('./FormAdmin/FormItemEditorLayout') },
          { path: 'section/:sectionId', lazy: () => import('./FormAdmin/FormSectionEditorLayout') },
        ],
      },
      {
        path: '/liquid_docs',
        id: NamedRoute.LiquidDocs,
        loader: liquidDocsLoader,
        children: [
          { path: 'assigns/:name', lazy: () => import('./LiquidDocs/AssignDoc') },
          { path: 'filters/:name', lazy: () => import('./LiquidDocs/FilterDoc') },
          { path: 'tags/:name', lazy: () => import('./LiquidDocs/LiquidTagDoc') },
          { index: true, lazy: () => import('./LiquidDocs') },
        ],
      },
      {
        element: <AppRootLayoutContent />,
        children: appLayoutRoutes,
      },
    ],
  },
];

export type AppRouterProps = {
  alert?: ReactNode;
};

function AppRouter({ alert }: AppRouterProps): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(alert != null);

  useEffect(() => {
    reloadOnAppEntrypointHeadersMismatch();
  }, [location.pathname]);

  return (
    <>
      <div
        className="position-fixed d-flex flex-column justify-content-center"
        style={{ zIndex: 1050, width: '100vw', height: '100vh', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <PageLoadingIndicator visible={navigation.state === 'loading'} />
      </div>
      <Suspense fallback={<PageLoadingIndicator visible />}>
        {showAlert && (
          <div className="alert alert-danger" role="alert">
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}
              aria-label={t('buttons.close')}
            >
              <span aria-hidden="true">×</span>
            </button>
            {alert}
          </div>
        )}

        <Outlet />
      </Suspense>
    </>
  );
}

export default AppRouter;
