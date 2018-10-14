import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import UserActivityAlertsList from './UserActivityAlertsList';

const UserActivityAlertsAdmin = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <BreadcrumbItemWithRoute
            path="/"
            to="/"
            active={({ location }) => location.pathname === '/'}
          >
            User activity alerts
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>

      <Switch>
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
