import { useState, Suspense, useEffect, ReactNode, useContext } from 'react';
import { useLocation, RouteObject, replace, Outlet, LoaderFunction, redirect, useNavigation } from 'react-router-dom';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import PageComponents from './PageComponents';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import FourOhFourPage from './FourOhFourPage';
import { SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import { eventsRoutes } from './EventsApp';
import NewCmsLayout from './CmsAdmin/CmsLayoutsAdmin/NewCmsLayout';
import CmsLayoutsAdminTable from './CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable';
import NewCmsPage from './CmsAdmin/CmsPagesAdmin/NewCmsPage';
import CmsPagesAdminTable from './CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable';
import useAuthorizationRequired, { AbilityName } from './Authentication/useAuthorizationRequired';
import { EventAdminEventsQueryData, EventAdminEventsQueryDocument } from './EventAdmin/queries.generated';
import { client } from './useIntercodeApolloClient';
import buildEventCategoryUrl from './EventAdmin/buildEventCategoryUrl';
import { adminSingleTicketTypeLoader, adminTicketTypesLoader } from './TicketTypeAdmin/loaders';

export enum NamedRoute {
  AdminUserConProfile = 'AdminUserConProfile',
  EditUserActivityAlert = 'EditUserActivityAlert',
  UserActivityAlerts = 'UserActivityAlerts',
}

function CmsPageBySlug() {
  // react-router 6 doesn't allow slashes in params, so we're going to do our own parsing here
  const location = useLocation();
  const slug = location.pathname.replace(/^\/pages\//, '').replace(/\/$/, '');
  return <PageComponents.CmsPage slug={slug} />;
}

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

function NonCMSPageWrapper() {
  return (
    <div className="non-cms-page">
      <Outlet />
    </div>
  );
}

const cmsPageRoutes: RouteObject[] = [
  { path: '/pages/*', element: <CmsPageBySlug /> },
  { index: true, element: <PageComponents.CmsPage rootPage /> },
];

const commonRoutes: RouteObject[] = [
  {
    element: <PageComponents.CmsAdmin />,
    children: [
      {
        path: '/cms_pages/*',
        children: [
          { path: ':id/edit', element: <PageComponents.EditCmsPage /> },
          { path: ':id/view_source', element: <PageComponents.ViewCmsPageSource /> },
          { path: 'new', element: <NewCmsPage /> },
          { path: '', element: <CmsPagesAdminTable /> },
        ],
      },
      {
        path: '/cms_partials/*',
        children: [
          { path: ':id/edit', element: <PageComponents.EditCmsPartial /> },
          { path: ':id/view_source', element: <PageComponents.ViewCmsPartialSource /> },
          { path: 'new', element: <PageComponents.NewCmsPartial /> },
          { path: '', element: <PageComponents.CmsPartialsAdminTable /> },
        ],
      },
      { path: '/cms_files/*', element: <PageComponents.CmsFilesAdmin /> },
      { path: '/cms_navigation_items/*', element: <PageComponents.NavigationItemsAdmin /> },
      {
        path: '/cms_layouts/*',
        children: [
          { path: ':id/edit', element: <PageComponents.EditCmsLayout /> },
          { path: ':id/view_source', element: <PageComponents.ViewCmsLayoutSource /> },
          { path: 'new', element: <NewCmsLayout /> },
          { path: '', element: <CmsLayoutsAdminTable /> },
        ],
      },
      { path: '/cms_variables/*', element: <PageComponents.CmsVariablesAdmin /> },
      {
        path: '/cms_graphql_queries/*',
        children: [
          { path: ':id/edit', element: <PageComponents.EditCmsGraphqlQuery /> },
          { path: ':id/view_source', element: <PageComponents.ViewCmsGraphqlQuerySource /> },
          { path: 'new', element: <PageComponents.NewCmsGraphqlQuery /> },
          { path: '', element: <PageComponents.CmsGraphqlQueriesAdminTable /> },
        ],
      },
      {
        path: '/cms_content_groups/*',
        children: [
          { path: ':id/edit', element: <PageComponents.EditCmsContentGroup /> },
          { path: 'new', element: <PageComponents.NewCmsContentGroup /> },
          { path: ':id', element: <PageComponents.ViewCmsContentGroup /> },
          { path: '', element: <PageComponents.CmsContentGroupsAdminTable /> },
        ],
      },
    ],
  },
  { path: '/oauth/applications-embed', element: <PageComponents.OAuthApplications /> },
  { path: '/oauth/authorize', element: <PageComponents.OAuthAuthorizationPrompt /> },
  { path: '/oauth/authorized_applications', element: <PageComponents.AuthorizedApplications /> },
  { path: '/users/edit', element: <PageComponents.EditUser /> },
  { path: '/users/password/edit', element: <PageComponents.ResetPassword /> },
];

const commonInConventionRoutes: RouteObject[] = [
  {
    path: '/admin_departments/*',
    element: <AuthorizationRequiredRouteGuard abilities={['can_update_departments']} />,
    children: [
      { path: ':id/edit', element: <PageComponents.EditDepartment /> },
      { path: 'new', element: <PageComponents.NewDepartment /> },
      { path: '', element: <PageComponents.DepartmentAdminIndex /> },
    ],
  },
  {
    path: '/admin_events/*',
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
      {
        path: '',
        loader: eventAdminRootRedirect,
      },
    ],
  },
  { path: '/admin_forms/*', element: <PageComponents.FormAdmin /> },
  { path: '/admin_notifications/*', element: <PageComponents.NotificationAdmin /> },
  { path: '/admin_store/*', element: <PageComponents.StoreAdmin /> },
  { path: '/cart', element: <PageComponents.Cart /> },
  { path: '/clickwrap_agreement', element: <PageComponents.ClickwrapAgreement /> },
  { path: '/convention/edit', element: <PageComponents.ConventionAdmin /> },
  { path: '/events/*', children: eventsRoutes },
  { path: '/mailing_lists/*', element: <PageComponents.MailingLists /> },
  { path: '/my_profile/*', element: <PageComponents.MyProfile /> },
  { path: '/order_history', element: <PageComponents.OrderHistory /> },
  { path: '/products/:id', element: <PageComponents.ProductPage /> },
  { path: '/reports/*', element: <PageComponents.Reports /> },
  { path: '/rooms', element: <PageComponents.RoomsAdmin /> },
  {
    element: <AppRootContextRouteGuard guard={({ signupMode }) => signupMode === SignupMode.Moderated} />,
    children: [{ path: '/signup_moderation/*', element: <PageComponents.SignupModeration /> }],
  },
  { path: '/signup_rounds/*', element: <PageComponents.SignupRoundsAdmin /> },
  { path: '/staff_positions/*', element: <PageComponents.StaffPositionAdmin /> },
  { path: '/ticket/*', element: <PageComponents.MyTicket /> },
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
    path: '/user_activity_alerts/*',
    id: NamedRoute.UserActivityAlerts,
    lazy: () => import('./UserActivityAlerts/UserActivityAlertsAdmin'),
    children: [
      { path: 'new', lazy: () => import('./UserActivityAlerts/NewUserActivityAlert') },
      {
        path: ':id/edit',
        id: NamedRoute.EditUserActivityAlert,
        lazy: () => import('./UserActivityAlerts/EditUserActivityAlert'),
      },
      { path: '', lazy: () => import('./UserActivityAlerts/UserActivityAlertsList') },
    ],
  },
  {
    path: '/user_con_profiles/*',
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
          { path: '', lazy: () => import('./UserConProfiles/UserConProfileAdminDisplay') },
        ],
      },
      { path: '', lazy: () => import('./UserConProfiles/AttendeesPage') },
    ],
  },
  ...commonRoutes,
];

const conventionModeRoutes: RouteObject[] = [
  { path: '/admin_event_proposals/*', element: <PageComponents.EventProposalsAdmin /> },
  {
    path: '/event_categories/*',
    element: <PageComponents.EventCategoryAdmin />,
    children: [
      { path: 'new', element: <PageComponents.NewEventCategory /> },
      { path: ':id/edit', element: <PageComponents.EditEventCategory /> },
      { path: '', element: <PageComponents.EventCategoryIndex /> },
    ],
  },
  { path: '/event_proposals/:id/edit', element: <PageComponents.EditEventProposal /> },
  { path: '/event_proposals', loader: () => replace('/pages/new-proposal') },
];

const singleEventModeRoutes: RouteObject[] = [];

const rootSiteRoutes: RouteObject[] = [
  {
    path: '/conventions/*',
    element: <PageComponents.RootSiteConventionsAdmin />,
    children: [
      { path: ':id', element: <PageComponents.ConventionDisplay /> },
      { path: '', element: <PageComponents.RootSiteConventionsAdminTable /> },
    ],
  },
  { path: '/email_routes', element: <PageComponents.RootSiteEmailRoutesAdmin /> },
  {
    path: '/organizations/*',
    element: <PageComponents.OrganizationAdmin />,
    children: [
      { path: ':id/roles/new', element: <PageComponents.NewOrganizationRole /> },
      { path: ':organizationId/roles/:organizationRoleId/edit', element: <PageComponents.EditOrganizationRole /> },
      { path: ':id', element: <PageComponents.OrganizationDisplay /> },
      { path: '', element: <PageComponents.OrganizationIndex /> },
    ],
  },
  {
    path: '/root_site',
    element: <PageComponents.CmsAdmin />,
    children: [{ path: '', element: <PageComponents.RootSiteAdmin /> }],
  },
  {
    path: '/users',
    lazy: () => import('./Users/UsersAdmin'),
    children: [
      { path: ':id', lazy: () => import('./Users/UserAdminDisplay') },
      { path: '', lazy: () => import('./Users/UsersTable') },
    ],
  },
];

export const routes: RouteObject[] = [
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
    ],
  },
  ...cmsPageRoutes,
  { path: '*', element: <FourOhFourPage /> },
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
