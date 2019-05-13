import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import CmsPage from './CmsPage';
import PageLoadingIndicator from './PageLoadingIndicator';

const ConventionAdmin = lazy(() => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'));
const EventAdmin = lazy(() => import(/* webpackChunkName: "event-admin" */ './EventAdmin'));
const EventCategoryAdmin = lazy(() => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'));
const EventProposalsAdmin = lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'));
const TicketTypeAdmin = lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin'));
const UserConProfilesAdmin = lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin'));

function AppRouter() {
  return (
    <Suspense fallback={<PageLoadingIndicator visible />}>
      <Switch>
        <Route path="/admin_event_proposals" component={EventProposalsAdmin} />
        <Route path="/admin_events" component={EventAdmin} />
        <Route path="/convention/edit" component={ConventionAdmin} />
        <Route path="/event_categories" component={EventCategoryAdmin} />
        <Route path="/ticket_types" component={TicketTypeAdmin} />
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
