import React, {
  useState, useContext, Suspense, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';

import PageLoadingIndicator from './PageLoadingIndicator';
import AppRootContext from './AppRootContext';
import PageComponents from './PageComponents';
import { reloadOnBundleHashMismatch } from './checkBundleHash';
import FourOhFourPage from './FourOhFourPage';

function renderCommonRoutes() {
  return [
    <Route path="/cms_pages" component={PageComponents.CmsAdmin} key="cmsPages" />,
    <Route path="/cms_partials" component={PageComponents.CmsAdmin} key="cmsPartials" />,
    <Route path="/cms_files" component={PageComponents.CmsAdmin} key="cmsFiles" />,
    <Route path="/cms_navigation_items" component={PageComponents.CmsAdmin} key="cmsNavigationItems" />,
    <Route path="/cms_layouts" component={PageComponents.CmsAdmin} key="cmsLayouts" />,
    <Route path="/cms_variables" component={PageComponents.CmsAdmin} key="cmsVariables" />,
    <Route path="/cms_graphql_queries" component={PageComponents.CmsAdmin} key="cmsGraphqlQueries" />,
    <Route path="/cms_content_groups" component={PageComponents.CmsAdmin} key="cmsContentGroups" />,
    <Route path="/oauth/applications-embed" component={PageComponents.OAuthApplications} key="oauthApplications" />,
    <Route path="/oauth/authorize" component={PageComponents.OAuthAuthorizationPrompt} key="oauthAuthorization" />,
    <Route path="/oauth/authorized_applications" component={PageComponents.AuthorizedApplications} key="oauthAuthorizedApplications" />,
    <Route path="/users/edit" component={PageComponents.EditUser} key="editUser" />,
    <Route path="/users/password/edit" component={PageComponents.ResetPassword} key="resetPassword" />,
    <Route
      path="/pages/:slug([a-zA-Z0-9\-/]+)"
      render={(routeProps) => (
        <PageComponents.CmsPage {...routeProps} slug={routeProps.match.params.slug} />
      )}
      key="cmsPage"
    />,
    <Route
      path="/"
      exact
      render={(routeProps) => (
        <PageComponents.CmsPage {...routeProps} rootPage />
      )}
      key="cmsRootPage"
    />,
  ];
}

function renderCommonInConventionRoutes({ signupMode }) {
  return [
    <Route path="/admin_departments" component={PageComponents.DepartmentAdmin} key="adminDepartments" />,
    <Route path="/admin_events" component={PageComponents.EventAdmin} key="adminEvents" />,
    <Route path="/admin_forms" component={PageComponents.FormAdmin} key="adminForms" />,
    <Route path="/admin_notifications" component={PageComponents.NotificationAdmin} key="adminNotifications" />,
    <Route path="/admin_store" component={PageComponents.StoreAdmin} key="adminStore" />,
    <Route path="/cart" component={PageComponents.Cart} key="cart" />,
    <Route path="/clickwrap_agreement" component={PageComponents.WrappedClickwrapAgreement} key="clickwrapAgreement" />,
    <Route path="/convention/edit" component={PageComponents.ConventionAdmin} key="conventionAdmin" />,
    <Route path="/events" component={PageComponents.EventsApp} key="eventsApp" />,
    <Route path="/mailing_lists" component={PageComponents.MailingLists} key="mailingLists" />,
    <Route path="/my_profile" component={PageComponents.MyProfile} key="myProfile" />,
    <Route path="/order_history" component={PageComponents.OrderHistory} key="orderHistory" />,
    <Route path="/products/:id" component={PageComponents.ProductPage} key="productPage" />,
    <Route path="/reports" component={PageComponents.Reports} key="reports" />,
    <Route path="/rooms" component={PageComponents.RoomsAdmin} key="rooms" />,
    ...(signupMode === 'moderated'
      ? [<Route path="/signup_moderation" component={PageComponents.SignupModeration} key="signupModeration" />]
      : []
    ),
    <Route path="/staff_positions" component={PageComponents.StaffPositionAdmin} key="staffPositions" />,
    <Route path="/ticket" component={PageComponents.MyTicket} key="myTicket" />,
    <Route path="/ticket_types" component={PageComponents.TicketTypeAdmin} key="ticketTypes" />,
    <Route path="/user_activity_alerts" component={PageComponents.UserActivityAlertsAdmin} key="userActivityAlerts" />,
    <Route path="/user_con_profiles" component={PageComponents.UserConProfilesAdmin} key="userConProfiles" />,
    ...renderCommonRoutes(),
  ];
}

function renderConventionModeRoutes({ signupMode }) {
  return [
    <Route path="/admin_event_proposals" component={PageComponents.EventProposalsAdmin} key="adminEventProposals" />,
    <Route path="/event_categories" component={PageComponents.EventCategoryAdmin} key="eventCategories" />,
    <Route path="/event_proposals/:id/edit" component={PageComponents.EditEventProposal} key="editEventProposal" />,
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
    <Route path="/organizations" component={PageComponents.OrganizationAdmin} key="organizations" />,
    <Route path="/root_site" component={PageComponents.CmsAdmin} key="rootSite" />,

    // these are duplicates of ones in common routes, but we need them to be above the /users route
    <Route path="/users/edit" component={PageComponents.EditUser} key="editUser" />,
    <Route path="/users/password/edit" component={PageComponents.ResetPassword} key="resetPassword" />,

    <Route path="/users" component={PageComponents.UsersAdmin} key="usersAdmin" />,
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
        <Route path="/" component={FourOhFourPage} />
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
