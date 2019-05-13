import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPage from './CmsPage';
import PageLoadingIndicator from './PageLoadingIndicator';

const CmsAdmin = lazy(() => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin'));
const ConventionAdmin = lazy(() => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'));
const EventAdmin = lazy(() => import(/* webpackChunkName: "event-admin" */ './EventAdmin'));
const EventCategoryAdmin = lazy(() => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'));
const EventProposalsAdmin = lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'));
const FormAdmin = lazy(() => import(/* webpackChunkName: "form-admin" */ './FormAdmin'));
const MailingLists = lazy(() => import(/* webpackChunkName: "mailing-lists" */ './MailingLists'));
// TODO OAuthApplications
// TODO OAuthAuthorizations
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ './Reports'));
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
        <Route path="/cms_pages" component={CmsAdmin} />
        <Route path="/cms_partials" component={CmsAdmin} />
        <Route path="/cms_files" component={CmsAdmin} />
        <Route path="/cms_navigation_items" component={CmsAdmin} />
        <Route path="/cms_layouts" component={CmsAdmin} />
        <Route path="/cms_variables" component={CmsAdmin} />
        <Route path="/cms_graphql_queries" component={CmsAdmin} />
        <Route path="/convention/edit" component={ConventionAdmin} />
        <Route path="/event_categories" component={EventCategoryAdmin} />
        <Route path="/mailing_lists" component={MailingLists} />
        <Route path="/reports" component={Reports} />
        <Route path="/rooms" component={RoomsAdmin} />
        <Route path="/staff_positions" component={StaffPositionAdmin} />
        <Route path="/ticket_types" component={TicketTypeAdmin} />
        <Route path="/user_activity_alerts" component={UserActivityAlertsAdmin} />
        <Route path="/user_con_profiles" component={UserConProfilesAdmin} />
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
