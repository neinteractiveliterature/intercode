import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import CmsPage from './CmsPage';
import PageLoadingIndicator from './PageLoadingIndicator';

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
// TODO OAuthApplications
const OAuthAuthorizationPrompt = lazy(() => import(/* webpackChunkName: "oauth-authorization-prompt" */ './OAuth/AuthorizationPrompt'));
const OrderHistory = lazy(() => import(/* webpackChunkName: "store" */ './Store/OrderHistory'));
const ProductPage = lazy(() => import(/* webpackChunkName: "store" */ './Store/ProductPage'));
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ './Reports'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './Authentication/ResetPassword'));
const RoomsAdmin = lazy(() => import(/* webpackChunkName: "rooms-admin" */ './RoomsAdmin'));
const StaffPositionAdmin = lazy(() => import(/* webpackChunkName: "staff-position-admin" */ './StaffPositionAdmin'));
const StoreAdmin = lazy(() => import(/* webpackChunkName: "store-admin" */ './Store/StoreAdmin'));
const TicketTypeAdmin = lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin'));
const UserActivityAlertsAdmin = lazy(() => import(/* webpackChunkName: "user-activity-alerts-admin" */ './UserActivityAlerts/UserActivityAlertsAdmin'));
const UserConProfilesAdmin = lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin'));

function AppRouter() {
  return (
    <Suspense fallback={<PageLoadingIndicator visible />}>
      <Switch>
        <Route path="/admin_event_proposals" component={EventProposalsAdmin} />
        <Route path="/admin_events" component={EventAdmin} />
        <Route path="/admin_forms" component={FormAdmin} />
        <Route path="/admin_store" component={StoreAdmin} />
        <Route path="/cart" component={Cart} />
        <Route path="/cms_pages" component={CmsAdmin} />
        <Route path="/cms_partials" component={CmsAdmin} />
        <Route path="/cms_files" component={CmsAdmin} />
        <Route path="/cms_navigation_items" component={CmsAdmin} />
        <Route path="/cms_layouts" component={CmsAdmin} />
        <Route path="/cms_variables" component={CmsAdmin} />
        <Route path="/cms_graphql_queries" component={CmsAdmin} />
        <Route path="/convention/edit" component={ConventionAdmin} />
        <Route path="/event_categories" component={EventCategoryAdmin} />
        <Route path="/event_proposals/:id/edit" component={EditEventProposal} />
        <Route path="/event_proposals" render={() => <Redirect to="/pages/new-proposal" />} />
        <Route path="/events" component={EventsApp} />
        <Route path="/mailing_lists" component={MailingLists} />
        <Route path="/my_profile" component={MyProfile} />
        <Route path="/oauth/authorize" component={OAuthAuthorizationPrompt} />
        <Route path="/order_history" component={OrderHistory} />
        <Route path="/products/:id" component={ProductPage} />
        <Route path="/reports" component={Reports} />
        <Route path="/rooms" component={RoomsAdmin} />
        <Route path="/staff_positions" component={StaffPositionAdmin} />
        <Route path="/ticket" component={MyTicket} />
        <Route path="/ticket_types" component={TicketTypeAdmin} />
        <Route path="/user_activity_alerts" component={UserActivityAlertsAdmin} />
        <Route path="/user_con_profiles" component={UserConProfilesAdmin} />
        <Route path="/users/edit" component={EditUser} />
        <Route path="/users/password/edit" component={ResetPassword} />
        <Route
          path="/pages/:slug([a-zA-Z0-9\-/]+)"
          render={routeProps => (
            <CmsPage {...routeProps} slug={routeProps.match.params.slug} />
          )}
        />
        <Route
          path="/"
          exact
          render={routeProps => (
            <CmsPage {...routeProps} rootPage />
          )}
        />
      </Switch>
    </Suspense>
  );
}

export default AppRouter;
