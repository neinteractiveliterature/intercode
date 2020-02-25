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
