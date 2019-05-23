import React, {
  useState, useContext, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import CmsPage from './CmsPage';
import PageLoadingIndicator from './PageLoadingIndicator';
import ClickwrapAgreement from './ClickwrapAgreement';
import AppRootContext from './AppRootContext';

const Cart = lazy(() => import(/* webpackChunkName: "store" */ './Store/Cart'));
const CmsAdmin = lazy(() => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin'));
const ConventionAdmin = lazy(() => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'));
const EditUser = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './Authentication/EditUser'));
const EventAdmin = lazy(() => import(/* webpackChunkName: "event-admin" */ './EventAdmin'));
const EventCategoryAdmin = lazy(() => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'));
const EventProposalsAdmin = lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'));
const EventsApp = lazy(() => import(/* webpackChunkName: "events-app" */ './EventsApp'));
const EditEventProposal = lazy(() => import(/* webpackChunkName: "edit-event-proposal" */ './EventProposals/EditEventProposal'));
const FormAdmin = lazy(() => import(/* webpackChunkName: "form-admin" */ './FormAdmin'));
const MailingLists = lazy(() => import(/* webpackChunkName: "mailing-lists" */ './MailingLists'));
const MyProfile = lazy(() => import(/* webpackChunkName: "my-profile" */ './MyProfile'));
const MyTicket = lazy(() => import(/* webpackChunkName: 'my-ticket' */ './MyTicket'));
const OAuthApplications = lazy(() => import(/* webpackChunkName: "oauth-applications" */ './OAuthApplications'));
const OAuthAuthorizationPrompt = lazy(() => import(/* webpackChunkName: "oauth-authorization-prompt" */ './OAuth/AuthorizationPrompt'));
const OrderHistory = lazy(() => import(/* webpackChunkName: "store" */ './Store/OrderHistory'));
const OrganizationAdmin = lazy(() => import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin'));
const ProductPage = lazy(() => import(/* webpackChunkName: "store" */ './Store/ProductPage'));
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ './Reports'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './Authentication/ResetPassword'));
const RoomsAdmin = lazy(() => import(/* webpackChunkName: "rooms-admin" */ './RoomsAdmin'));
const StaffPositionAdmin = lazy(() => import(/* webpackChunkName: "staff-position-admin" */ './StaffPositionAdmin'));
const StoreAdmin = lazy(() => import(/* webpackChunkName: "store-admin" */ './Store/StoreAdmin'));
const TicketTypeAdmin = lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin'));
const UserActivityAlertsAdmin = lazy(() => import(/* webpackChunkName: "user-activity-alerts-admin" */ './UserActivityAlerts/UserActivityAlertsAdmin'));
const UserConProfilesAdmin = lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin'));
const UsersAdmin = lazy(() => import(/* webpackChunkName: "users-admin" */ './Users/UsersAdmin'));

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
    <Route path="/users/edit" component={EditUser} />,
    <Route path="/users/password/edit" component={ResetPassword} />,
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
    <Route path="/clickwrap_agreement" component={ClickwrapAgreement} key="clickwrapAgreement" />,
    <Route path="/convention/edit" component={ConventionAdmin} key="conventionAdmin" />,
    <Route path="/events" component={EventsApp} />,
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
    <Route path="/organizations" component={OrganizationAdmin} />,
    <Route path="/root_site" component={CmsAdmin} />,
    <Route path="/users" component={UsersAdmin} />,
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
