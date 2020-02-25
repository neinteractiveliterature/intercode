import React from 'react';
import {
  Switch, Redirect, Route, useRouteMatch,
} from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditUserActivityAlert from './EditUserActivityAlert';
import NewUserActivityAlert from './NewUserActivityAlert';
import UserActivityAlertsList from './UserActivityAlertsList';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';

const UserActivityAlertsAdmin = () => {
  const rootMatch = useRouteMatch({ path: '/user_activity_alerts', exact: true });

  return (
    <>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <BreadcrumbItem to="/user_activity_alerts" active={!!rootMatch}>
            User activity alerts
          </BreadcrumbItem>

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
};

export default UserActivityAlertsAdmin;
