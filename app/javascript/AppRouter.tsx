import { useState, Suspense, useEffect, ReactNode, useContext } from 'react';
import { useLocation, RouteObject, replace, Outlet } from 'react-router-dom';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import PageComponents from './PageComponents';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import FourOhFourPage from './FourOhFourPage';
import { SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';
import AppRootContext, { AppRootContextValue } from './AppRootContext';
import { eventsRoutes } from './EventsApp';

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

const commonRoutes: RouteObject[] = [
  {
    element: <PageComponents.CmsAdmin />,
    children: [
      { path: '/cms_pages/*', element: <PageComponents.CmsPagesAdmin /> },
      { path: '/cms_partials/*', element: <PageComponents.CmsPartialsAdmin /> },
      { path: '/cms_files/*', element: <PageComponents.CmsFilesAdmin /> },
      { path: '/cms_navigation_items/*', element: <PageComponents.NavigationItemsAdmin /> },
      { path: '/cms_layouts/*', element: <PageComponents.CmsLayoutsAdmin /> },
      { path: '/cms_variables/*', element: <PageComponents.CmsVariablesAdmin /> },
      { path: '/cms_graphql_queries/*', element: <PageComponents.CmsGraphqlQueriesAdmin /> },
      { path: '/cms_content_groups/*', element: <PageComponents.CmsContentGroupsAdmin /> },
    ],
  },
  { path: '/oauth/applications-embed', element: <PageComponents.OAuthApplications /> },
  { path: '/oauth/authorize', element: <PageComponents.OAuthAuthorizationPrompt /> },
  { path: '/oauth/authorized_applications', element: <PageComponents.AuthorizedApplications /> },
  { path: '/users/edit', element: <PageComponents.EditUser /> },
  { path: '/users/password/edit', element: <PageComponents.ResetPassword /> },
  { path: '/pages/*', element: <CmsPageBySlug /> },
  { index: true, element: <PageComponents.CmsPage rootPage /> },
];

const commonInConventionRoutes: RouteObject[] = [
  { path: '/admin_departments/*', element: <PageComponents.DepartmentAdmin /> },
  { path: '/admin_events/*', element: <PageComponents.EventAdmin /> },
  { path: '/admin_forms/*', element: <PageComponents.FormAdmin /> },
  { path: '/admin_notifications/*', element: <PageComponents.NotificationAdmin /> },
  { path: '/admin_store/*', element: <PageComponents.StoreAdmin /> },
  { path: '/cart', element: <PageComponents.Cart /> },
  { path: '/clickwrap_agreement', element: <PageComponents.WrappedClickwrapAgreement /> },
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
    children: [{ path: '/ticket_types/*', element: <PageComponents.TicketTypeAdmin /> }],
  },
  { path: '/user_activity_alerts/*', element: <PageComponents.UserActivityAlertsAdmin /> },
  { path: '/user_con_profiles/*', element: <PageComponents.UserConProfilesAdmin /> },
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
  ...commonInConventionRoutes,
];

const singleEventModeRoutes = [...commonInConventionRoutes];

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
    element: <PageComponents.UsersAdmin />,
    children: [{ path: ':id', element: <PageComponents.UserAdminDisplay /> }],
  },
];

export const routes: RouteObject[] = [
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
    element: <AppRootContextRouteGuard guard={({ conventionName }) => conventionName == null} />,
    children: rootSiteRoutes,
  },
  { path: '*', element: <FourOhFourPage /> },
];

export type AppRouterProps = {
  alert?: ReactNode;
};

function AppRouter({ alert }: AppRouterProps): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(alert != null);

  useEffect(() => {
    reloadOnAppEntrypointHeadersMismatch();
  }, [location.pathname]);

  return (
    <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
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
  );
}

export default AppRouter;
