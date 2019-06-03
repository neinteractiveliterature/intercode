import React, {
  useState, useContext, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import CmsPage from './CmsPage';
import PageLoadingIndicator from './PageLoadingIndicator';
import ClickwrapAgreement from './ClickwrapAgreement';
import AppRootContext from './AppRootContext';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function NonCMSPageWrapper(WrappedComponent) {
  const wrapper = props => (
    <div className="non-cms-page">
      <WrappedComponent {...props} />
    </div>
  );
  wrapper.displayName = `NonCMSPageWrapper(${getDisplayName(WrappedComponent)})`;
  return wrapper;
}

const Cart = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "store" */ './Store/Cart')));
const CmsAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin')));
const ConventionAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin')));
const EditUser = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "authentication-forms" */ './Authentication/EditUser')));
const EventAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "event-admin" */ './EventAdmin')));
const EventCategoryAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin')));
const EventProposalsAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin')));
const EventsApp = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "events-app" */ './EventsApp')));
const EditEventProposal = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "edit-event-proposal" */ './EventProposals/EditEventProposal')));
const FormAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "form-admin" */ './FormAdmin')));
const MailingLists = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "mailing-lists" */ './MailingLists')));
const MyProfile = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "my-profile" */ './MyProfile')));
const MyTicket = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: 'my-ticket' */ './MyTicket')));
const OAuthApplications = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "oauth-applications" */ './OAuthApplications')));
const OAuthAuthorizationPrompt = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "oauth-authorization-prompt" */ './OAuth/AuthorizationPrompt')));
const OrderHistory = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "store" */ './Store/OrderHistory')));
const OrganizationAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin')));
const ProductPage = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "store" */ './Store/ProductPage')));
const Reports = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "reports" */ './Reports')));
const ResetPassword = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "authentication-forms" */ './Authentication/ResetPassword')));
const RoomsAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "rooms-admin" */ './RoomsAdmin')));
const StaffPositionAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "staff-position-admin" */ './StaffPositionAdmin')));
const StoreAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "store-admin" */ './Store/StoreAdmin')));
const TicketTypeAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin')));
const UserActivityAlertsAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "user-activity-alerts-admin" */ './UserActivityAlerts/UserActivityAlertsAdmin')));
const UserConProfilesAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin')));
const UsersAdmin = NonCMSPageWrapper(lazy(() => import(/* webpackChunkName: "users-admin" */ './Users/UsersAdmin')));
const WrappedClickwrapAgreement = NonCMSPageWrapper(ClickwrapAgreement);

function renderCommonRoutes() {
  return [
    <Route path="/cms_pages" component={CmsAdmin} key="cmsPages" />,
    <Route path="/cms_partials" component={CmsAdmin} key="cmsPartials" />,
    <Route path="/cms_files" component={CmsAdmin} key="cmsFiles" />,
    <Route path="/cms_navigation_items" component={CmsAdmin} key="cmsNavigationItems" />,
    <Route path="/cms_layouts" component={CmsAdmin} key="cmsLayouts" />,
    <Route path="/cms_variables" component={CmsAdmin} key="cmsVariables" />,
    <Route path="/cms_graphql_queries" component={CmsAdmin} key="cmsGraphqlQueries" />,
    <Route path="/oauth/applications-embed" component={OAuthApplications} key="oauthApplications" />,
    <Route path="/oauth/authorize" component={OAuthAuthorizationPrompt} key="oauthAuthorization" />,
    <Route path="/users/edit" component={EditUser} key="editUser" />,
    <Route path="/users/password/edit" component={ResetPassword} key="resetPassword" />,
    <Route
      path="/pages/:slug([a-zA-Z0-9\-/]+)"
      render={routeProps => (
        <CmsPage {...routeProps} slug={routeProps.match.params.slug} />
      )}
      key="cmsPage"
    />,
    <Route
      path="/"
      exact
      render={routeProps => (
        <CmsPage {...routeProps} rootPage />
      )}
      key="cmsRootPage"
    />,
  ];
}

function renderCommonInConventionRoutes() {
  return [
    <Route path="/admin_events" component={EventAdmin} key="adminEvents" />,
    <Route path="/admin_forms" component={FormAdmin} key="adminForms" />,
    <Route path="/admin_store" component={StoreAdmin} key="adminStore" />,
    <Route path="/cart" component={Cart} key="cart" />,
    <Route path="/clickwrap_agreement" component={WrappedClickwrapAgreement} key="clickwrapAgreement" />,
    <Route path="/convention/edit" component={ConventionAdmin} key="conventionAdmin" />,
    <Route path="/events" component={EventsApp} key="eventsApp" />,
    <Route path="/mailing_lists" component={MailingLists} key="mailingLists" />,
    <Route path="/my_profile" component={MyProfile} key="myProfile" />,
    <Route path="/order_history" component={OrderHistory} key="orderHistory" />,
    <Route path="/products/:id" component={ProductPage} key="productPage" />,
    <Route path="/reports" component={Reports} key="reports" />,
    <Route path="/rooms" component={RoomsAdmin} key="rooms" />,
    <Route path="/staff_positions" component={StaffPositionAdmin} key="staffPositions" />,
    <Route path="/ticket" component={MyTicket} key="myTicket" />,
    <Route path="/ticket_types" component={TicketTypeAdmin} key="ticketTypes" />,
    <Route path="/user_activity_alerts" component={UserActivityAlertsAdmin} key="userActivityAlerts" />,
    <Route path="/user_con_profiles" component={UserConProfilesAdmin} key="userConProfiles" />,
    ...renderCommonRoutes(),
  ];
}

function renderConventionModeRoutes() {
  return [
    <Route path="/admin_event_proposals" component={EventProposalsAdmin} key="adminEventProposals" />,
    <Route path="/event_categories" component={EventCategoryAdmin} key="eventCategories" />,
    <Route path="/event_proposals/:id/edit" component={EditEventProposal} key="editEventProposal" />,
    <Route path="/event_proposals" render={() => <Redirect to="/pages/new-proposal" />} key="eventProposals" />,
    ...renderCommonInConventionRoutes(),
  ];
}

function renderSingleEventModeRoutes() {
  return [
    ...renderCommonInConventionRoutes(),
  ];
}

function renderRootSiteRoutes() {
  return [
    <Route path="/organizations" component={OrganizationAdmin} key="organizations" />,
    <Route path="/root_site" component={CmsAdmin} key="rootSite" />,

    // these are duplicates of ones in common routes, but we need them to be above the /users route
    <Route path="/users/edit" component={EditUser} key="editUser" />,
    <Route path="/users/password/edit" component={ResetPassword} key="resetPassword" />,

    <Route path="/users" component={UsersAdmin} key="usersAdmin" />,
    ...renderCommonRoutes(),
  ];
}

function AppRouter({ alert }) {
  const { conventionName, siteMode } = useContext(AppRootContext);
  const [showAlert, setShowAlert] = useState(alert != null);

  const renderRoutes = () => {
    if (!conventionName) {
      return renderRootSiteRoutes();
    }

    if (siteMode === 'single_event') {
      return renderSingleEventModeRoutes();
    }

    return renderConventionModeRoutes();
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
        <Route
          path="/"
          render={({ location }) => (
            <div className="alert alert-warning">
              <h1>Oops!</h1>

              <p className="mb-0">
                We couldn&rsquo;t find a page at the location
                {' '}
                {location.pathname}
                .
              </p>
            </div>
          )}
        />
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
