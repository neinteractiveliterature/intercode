import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import EditUserActivityAlert from './EditUserActivityAlert';
import NewUserActivityAlert from './NewUserActivityAlert';
import UserActivityAlertsList from './UserActivityAlertsList';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

const UserActivityAlertsAdmin = () => {
  const authorizationWarning = useAuthorizationRequired('can_read_user_activity_alerts');
  if (authorizationWarning) return authorizationWarning;

  return (
    <>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: '/user_activity_alerts', exact: true }}
            to="/user_activity_alerts"
          >
            User activity alerts
          </RouteActivatedBreadcrumbItem>

          <Route path="/user_activity_alerts/new">
            <BreadcrumbItem active>Create</BreadcrumbItem>
          </Route>

          <Route path="/user_activity_alerts/:id/edit">
            <BreadcrumbItem active>Edit</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route path="/user_activity_alerts/new"><NewUserActivityAlert /></Route>
        <Route path="/user_activity_alerts/:id/edit"><EditUserActivityAlert /></Route>
        <Route path="/user_activity_alerts" exact><UserActivityAlertsList /></Route>
        <Redirect to="/user_activity_alerts" />
      </Switch>
    </>
  );
};

export default UserActivityAlertsAdmin;
