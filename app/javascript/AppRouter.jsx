import React, {
  useState, useContext, Suspense, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Redirect, useLocation, useParams,
} from 'react-router-dom';

import PageLoadingIndicator from './PageLoadingIndicator';
import AppRootContext from './AppRootContext';
import PageComponents from './PageComponents';
import { reloadOnBundleHashMismatch } from './checkBundleHash';
import FourOhFourPage from './FourOhFourPage';

function CmsPageBySlug() {
  const { slug } = useParams();
  return <PageComponents.CmsPage slug={slug} />;
}

function renderCommonRoutes() {
  return [
    <Route path="/cms_pages" key="cmsPages"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_partials" key="cmsPartials"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_files" key="cmsFiles"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_navigation_items" key="cmsNavigationItems"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_layouts" key="cmsLayouts"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_variables" key="cmsVariables"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_graphql_queries" key="cmsGraphqlQueries"><PageComponents.CmsAdmin /></Route>,
    <Route path="/cms_content_groups" key="cmsContentGroups"><PageComponents.CmsAdmin /></Route>,
    <Route path="/oauth/applications-embed" key="oauthApplications"><PageComponents.OAuthApplications /></Route>,
    <Route path="/oauth/authorize" key="oauthAuthorization"><PageComponents.OAuthAuthorizationPrompt /></Route>,
    <Route path="/oauth/authorized_applications" key="oauthAuthorizedApplications"><PageComponents.AuthorizedApplications /></Route>,
    <Route path="/users/edit" key="editUser"><PageComponents.EditUser /></Route>,
    <Route path="/users/password/edit" key="resetPassword"><PageComponents.ResetPassword /></Route>,
    <Route path="/pages/:slug([a-zA-Z0-9\-/]+)" key="cmsPage"><CmsPageBySlug /></Route>,
    <Route path="/" exact key="cmsRootPage"><PageComponents.CmsPage rootPage /></Route>,
  ];
}

function renderCommonInConventionRoutes({ signupMode }) {
  return [
    <Route path="/admin_departments" key="adminDepartments"><PageComponents.DepartmentAdmin /></Route>,
    <Route path="/admin_events" key="adminEvents"><PageComponents.EventAdmin /></Route>,
    <Route path="/admin_forms" key="adminForms"><PageComponents.FormAdmin /></Route>,
    <Route path="/admin_notifications" key="adminNotifications"><PageComponents.NotificationAdmin /></Route>,
    <Route path="/admin_store" key="adminStore"><PageComponents.StoreAdmin /></Route>,
    <Route path="/cart" key="cart"><PageComponents.Cart /></Route>,
    <Route path="/clickwrap_agreement" key="clickwrapAgreement"><PageComponents.WrappedClickwrapAgreement /></Route>,
    <Route path="/convention/edit" key="conventionAdmin"><PageComponents.ConventionAdmin /></Route>,
    <Route path="/events" key="eventsApp"><PageComponents.EventsApp /></Route>,
    <Route path="/mailing_lists" key="mailingLists"><PageComponents.MailingLists /></Route>,
    <Route path="/my_profile" key="myProfile"><PageComponents.MyProfile /></Route>,
    <Route path="/order_history" key="orderHistory"><PageComponents.OrderHistory /></Route>,
    <Route path="/products/:id" key="productPage"><PageComponents.ProductPage /></Route>,
    <Route path="/reports" key="reports"><PageComponents.Reports /></Route>,
    <Route path="/rooms" key="rooms"><PageComponents.RoomsAdmin /></Route>,
    ...(signupMode === 'moderated'
      ? [<Route path="/signup_moderation" key="signupModeration"><PageComponents.SignupModeration /></Route>]
      : []
    ),
    <Route path="/staff_positions" key="staffPositions"><PageComponents.StaffPositionAdmin /></Route>,
    <Route path="/ticket" key="myTicket"><PageComponents.MyTicket /></Route>,
    <Route path="/ticket_types" key="ticketTypes"><PageComponents.TicketTypeAdmin /></Route>,
    <Route path="/user_activity_alerts" key="userActivityAlerts"><PageComponents.UserActivityAlertsAdmin /></Route>,
    <Route path="/user_con_profiles" key="userConProfiles"><PageComponents.UserConProfilesAdmin /></Route>,
    ...renderCommonRoutes(),
  ];
}

function renderConventionModeRoutes({ signupMode }) {
  return [
    <Route path="/admin_event_proposals" key="adminEventProposals"><PageComponents.EventProposalsAdmin /></Route>,
    <Route path="/event_categories" key="eventCategories"><PageComponents.EventCategoryAdmin /></Route>,
    <Route path="/event_proposals/:id/edit" key="editEventProposal"><PageComponents.EditEventProposal /></Route>,
    <Route path="/event_proposals" render={() => <Redirect to="/pages/new-proposal" />} key="eventProposals" />,
    ...renderCommonInConventionRoutes({ signupMode }),
  ];
}

function renderSingleEventModeRoutes({ signupMode }) {
  return [
    ...renderCommonInConventionRoutes({ signupMode }),
  ];
}

function renderRootSiteRoutes() {
  return [
    <Route path="/organizations" key="organizations"><PageComponents.OrganizationAdmin /></Route>,
    <Route path="/root_site" key="rootSite"><PageComponents.CmsAdmin /></Route>,

    // these are duplicates of ones in common routes, but we need them to be above the /users route
    <Route path="/users/edit" key="editUser"><PageComponents.EditUser /></Route>,
    <Route path="/users/password/edit" key="resetPassword"><PageComponents.ResetPassword /></Route>,

    <Route path="/users" key="usersAdmin"><PageComponents.UsersAdmin /></Route>,
    ...renderCommonRoutes(),
  ];
}

function AppRouter({ alert }) {
  const location = useLocation();
  const { conventionName, signupMode, siteMode } = useContext(AppRootContext);
  const [showAlert, setShowAlert] = useState(alert != null);

  useEffect(
    () => {
      reloadOnBundleHashMismatch();
    },
    [location.pathname],
  );

  const renderRoutes = () => {
    if (!conventionName) {
      return renderRootSiteRoutes();
    }

    if (siteMode === 'single_event') {
      return renderSingleEventModeRoutes({ signupMode });
    }

    return renderConventionModeRoutes({ signupMode });
  };

  return (
    <Suspense fallback={<PageLoadingIndicator visible />}>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          <button type="button" className="close" onClick={() => setShowAlert(false)} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          {alert}
        </div>
      )}

      <Switch>
        {renderRoutes()}
        <Route path="/"><FourOhFourPage /></Route>
      </Switch>
    </Suspense>
  );
}

AppRouter.propTypes = {
  alert: PropTypes.string,
};

AppRouter.defaultProps = {
  alert: null,
};

export default AppRouter;
