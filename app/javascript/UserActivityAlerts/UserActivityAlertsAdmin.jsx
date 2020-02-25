import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import EditUserActivityAlert from './EditUserActivityAlert';
import NewUserActivityAlert from './NewUserActivityAlert';
import UserActivityAlertsList from './UserActivityAlertsList';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';

const UserActivityAlertsAdmin = () => (
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
      <Route path="/user_activity_alerts/new" component={NewUserActivityAlert} />
      <Route path="/user_activity_alerts/:id/edit"><EditUserActivityAlert /></Route>
      <Route path="/user_activity_alerts" exact component={UserActivityAlertsList} />
      <Redirect to="/user_activity_alerts" />
    </Switch>
  </>
);

export default UserActivityAlertsAdmin;
