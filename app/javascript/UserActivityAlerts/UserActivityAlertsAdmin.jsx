import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Switch, Redirect, Route,
} from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditUserActivityAlert from './EditUserActivityAlert';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { UserActivityAlertQuery } from './queries.gql';
import UserActivityAlertsList from './UserActivityAlertsList';

const UserActivityAlertsAdmin = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <React.Fragment>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            path="/"
            to="/"
            active={({ location }) => location.pathname === '/'}
          >
            User activity alerts
          </BreadcrumbItemWithRoute>

          <Route
            path="/:id/edit"
            render={({ location }) => (
              <BreadcrumbItemWithRoute
                path="/:id/edit"
                to={location.pathname}
              >
                Edit
              </BreadcrumbItemWithRoute>
            )}
          />
        </ol>
      </nav>

      <Switch>
        <Route
          path="/:id/edit"
          render={({ match }) => (
            <QueryWithStateDisplay
              query={UserActivityAlertQuery}
              variables={{ id: Number.parseInt(match.params.id, 10) }}
            >
              {({ data }) => (
                <EditUserActivityAlert
                  initialUserActivityAlert={data.convention.user_activity_alert}
                  convention={data.convention}
                />
              )}
            </QueryWithStateDisplay>
          )}
        />
        <Route path="/" exact component={UserActivityAlertsList} />
        <Redirect to="/" />
      </Switch>
    </React.Fragment>
  </BrowserRouter>
);

UserActivityAlertsAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default UserActivityAlertsAdmin;
