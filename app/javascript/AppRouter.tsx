import { useState, useContext, Suspense, useEffect, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PageLoadingIndicator } from '@neinteractiveliterature/litform';

import AppRootContext from './AppRootContext';
import PageComponents from './PageComponents';
import { reloadOnAppEntrypointHeadersMismatch } from './checkAppEntrypointHeadersMatch';
import FourOhFourPage from './FourOhFourPage';
import { SignupMode, TicketMode } from './graphqlTypes.generated';

function CmsPageBySlug() {
  // react-router 6 doesn't allow slashes in params, so we're going to do our own parsing here
  const location = useLocation();
  const slug = location.pathname.replace(/^\/pages\//, '').replace(/\/$/, '');
  return <PageComponents.CmsPage slug={slug} />;
}

function renderCommonRoutes() {
  return [
    <Route element={<PageComponents.CmsAdmin />} key="cmsAdmin">
      <Route path="/cms_pages/*" element={<PageComponents.CmsPagesAdmin />} />,
      <Route path="/cms_partials/*" element={<PageComponents.CmsPartialsAdmin />} />,
      <Route path="/cms_files/*" element={<PageComponents.CmsFilesAdmin />} />,
      <Route path="/cms_navigation_items/*" element={<PageComponents.NavigationItemsAdmin />} />,
      <Route path="/cms_layouts/*" element={<PageComponents.CmsLayoutsAdmin />} />,
      <Route path="/cms_variables/*" element={<PageComponents.CmsVariablesAdmin />} />,
      <Route path="/cms_graphql_queries/*" element={<PageComponents.CmsGraphqlQueriesAdmin />} />,
      <Route path="/cms_content_groups/*" element={<PageComponents.CmsContentGroupsAdmin />} />,
    </Route>,
    <Route path="/oauth/applications-embed" key="oauthApplications" element={<PageComponents.OAuthApplications />} />,
    <Route path="/oauth/authorize" key="oauthAuthorization" element={<PageComponents.OAuthAuthorizationPrompt />} />,
    <Route
      path="/oauth/authorized_applications"
      key="oauthAuthorizedApplications"
      element={<PageComponents.AuthorizedApplications />}
    />,
    <Route path="/users/edit" key="editUser" element={<PageComponents.EditUser />} />,
    <Route path="/users/password/edit" key="resetPassword" element={<PageComponents.ResetPassword />} />,
    <Route path="/pages/*" key="cmsPage" element={<CmsPageBySlug />} />,
    <Route index key="cmsRootPage" element={<PageComponents.CmsPage rootPage />} />,
  ];
}

function renderCommonInConventionRoutes({
  signupMode,
  ticketMode,
}: {
  signupMode: SignupMode | undefined;
  ticketMode: TicketMode | undefined | null;
}) {
  return [
    <Route path="/admin_departments/*" key="adminDepartments" element={<PageComponents.DepartmentAdmin />} />,
    <Route path="/admin_events/*" key="adminEvents" element={<PageComponents.EventAdmin />} />,
    <Route path="/admin_forms/*" key="adminForms" element={<PageComponents.FormAdmin />} />,
    <Route path="/admin_notifications/*" key="adminNotifications" element={<PageComponents.NotificationAdmin />} />,
    <Route path="/admin_store/*" key="adminStore" element={<PageComponents.StoreAdmin />} />,
    <Route path="/cart" key="cart" element={<PageComponents.Cart />} />,
    <Route
      path="/clickwrap_agreement"
      key="clickwrapAgreement"
      element={<PageComponents.WrappedClickwrapAgreement />}
    />,
    <Route path="/convention/edit" key="conventionAdmin" element={<PageComponents.ConventionAdmin />} />,
    <Route path="/events/*" key="eventsApp" element={<PageComponents.EventsApp />} />,
    <Route path="/mailing_lists/*" key="mailingLists" element={<PageComponents.MailingLists />} />,
    <Route path="/my_profile/*" key="myProfile" element={<PageComponents.MyProfile />} />,
    <Route path="/order_history" key="orderHistory" element={<PageComponents.OrderHistory />} />,
    <Route path="/products/:id" key="productPage" element={<PageComponents.ProductPage />} />,
    <Route path="/reports/*" key="reports" element={<PageComponents.Reports />} />,
    <Route path="/rooms" key="rooms" element={<PageComponents.RoomsAdmin />} />,
    ...(signupMode === 'moderated'
      ? [<Route path="/signup_moderation/*" key="signupModeration" element={<PageComponents.SignupModeration />} />]
      : []),
    <Route path="/signup_rounds" key="signupRounds" element={<PageComponents.SignupRoundsAdmin />} />,
    <Route path="/staff_positions/*" key="staffPositions" element={<PageComponents.StaffPositionAdmin />} />,
    <Route path="/ticket/*" key="myTicket" element={<PageComponents.MyTicket />} />,
    ...(ticketMode === 'required_for_signup'
      ? [<Route path="/ticket_types/*" key="ticketTypes" element={<PageComponents.TicketTypeAdmin />} />]
      : []),
    <Route
      path="/user_activity_alerts/*"
      key="userActivityAlerts"
      element={<PageComponents.UserActivityAlertsAdmin />}
    />,
    <Route path="/user_con_profiles/*" key="userConProfiles" element={<PageComponents.UserConProfilesAdmin />} />,
    ...renderCommonRoutes(),
  ];
}

function renderConventionModeRoutes({
  signupMode,
  ticketMode,
}: {
  signupMode: SignupMode | undefined;
  ticketMode: TicketMode | undefined | null;
}) {
  return [
    <Route
      path="/admin_event_proposals/*"
      key="adminEventProposals"
      element={<PageComponents.EventProposalsAdmin />}
    />,
    <Route path="/event_categories/*" key="eventCategories" element={<PageComponents.EventCategoryAdmin />}>
      <Route path="new" element={<PageComponents.NewEventCategory />} />
      <Route path=":id/edit" element={<PageComponents.EditEventCategory />} />
      <Route path="" element={<PageComponents.EventCategoryIndex />} />
    </Route>,
    <Route path="/event_proposals/:id/edit" key="editEventProposal" element={<PageComponents.EditEventProposal />} />,
    <Route path="/event_proposals" key="eventProposals" element={<Navigate to="/pages/new-proposal" replace />} />,
    ...renderCommonInConventionRoutes({ signupMode, ticketMode }),
  ];
}

function renderSingleEventModeRoutes({
  signupMode,
  ticketMode,
}: {
  signupMode: SignupMode | undefined;
  ticketMode: TicketMode | undefined | null;
}) {
  return [...renderCommonInConventionRoutes({ signupMode, ticketMode })];
}

function renderRootSiteRoutes() {
  return [
    <Route path="/conventions/*" key="conventions" element={<PageComponents.RootSiteConventionsAdmin />}>
      <Route path=":id" element={<PageComponents.ConventionDisplay />} />
      <Route path="" element={<PageComponents.RootSiteConventionsAdminTable />} />
    </Route>,
    <Route path="/email_routes" key="emailRoutes" element={<PageComponents.RootSiteEmailRoutesAdmin />} />,
    <Route path="/organizations/*" key="organizations" element={<PageComponents.OrganizationAdmin />}>
      <Route path=":id/roles/new" element={<PageComponents.NewOrganizationRole />} />
      <Route path=":organizationId/roles/:organizationRoleId/edit" element={<PageComponents.EditOrganizationRole />} />
      <Route path=":id" element={<PageComponents.OrganizationDisplay />} />
      <Route path="" element={<PageComponents.OrganizationIndex />} />
    </Route>,
    <Route path="/root_site" key="rootSite" element={<PageComponents.CmsAdmin />}>
      <Route path="" element={<PageComponents.RootSiteAdmin />} />
    </Route>,
    <Route path="/users" key="usersAdmin" element={<PageComponents.UsersAdmin />}>
      <Route path=":id" element={<PageComponents.UserAdminDisplay />} />
      <Route path="" element={<PageComponents.UsersTable />} />
    </Route>,
    ...renderCommonRoutes(),
  ];
}

export type AppRouterProps = {
  alert?: ReactNode;
};

function AppRouter({ alert }: AppRouterProps): JSX.Element {
  const location = useLocation();
  const { conventionName, signupMode, siteMode, ticketMode } = useContext(AppRootContext);
  const [showAlert, setShowAlert] = useState(alert != null);

  useEffect(() => {
    reloadOnAppEntrypointHeadersMismatch();
  }, [location.pathname]);

  const renderRoutes = () => {
    if (!conventionName) {
      return renderRootSiteRoutes();
    }

    if (siteMode === 'single_event') {
      return renderSingleEventModeRoutes({ signupMode, ticketMode });
    }

    return renderConventionModeRoutes({ signupMode, ticketMode });
  };

  return (
    <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          <button type="button" className="btn-close" onClick={() => setShowAlert(false)} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          {alert}
        </div>
      )}

      <Routes>{[...renderRoutes(), <Route key="fourOhFour" path="*" element={<FourOhFourPage />} />]}</Routes>
    </Suspense>
  );
}

export default AppRouter;
