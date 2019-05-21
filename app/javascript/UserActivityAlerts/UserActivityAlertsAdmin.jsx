import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditUserActivityAlert from './EditUserActivityAlert';
import NewUserActivityAlert from './NewUserActivityAlert';
import UserActivityAlertsList from './UserActivityAlertsList';

const UserActivityAlertsAdmin = () => (
  <>
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          path="/user_activity_alerts"
          to="/user_activity_alerts"
          active={({ location }) => location.pathname === '/user_activity_alerts'}
        >
          User activity alerts
        </BreadcrumbItemWithRoute>

        <Route
          path="/user_activity_alerts/new"
          render={({ location }) => (
            <BreadcrumbItemWithRoute
              path="/user_activity_alerts/new"
              to={location.pathname}
            >
              Create
            </BreadcrumbItemWithRoute>
          )}
        />

        <Route
          path="/user_activity_alerts/:id/edit"
          render={({ location }) => (
            <BreadcrumbItemWithRoute
              path="/user_activity_alerts/:id/edit"
              to={location.pathname}
            >
              Edit
            </BreadcrumbItemWithRoute>
          )}
        />
      </ol>
    </nav>

    <Switch>
      <Route path="/user_activity_alerts/new" component={NewUserActivityAlert} />
      <Route
        path="/user_activity_alerts/:id/edit"
        render={({ match, history }) => (
          <EditUserActivityAlert
            userActivityAlertId={Number.parseInt(match.params.id, 10)}
            history={history}
          />
        )}
      />
      <Route path="/user_activity_alerts" exact component={UserActivityAlertsList} />
      <Redirect to="/user_activity_alerts" />
    </Switch>
  </>
);

export default UserActivityAlertsAdmin;
