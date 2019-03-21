import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import UsersTable from './UsersTable';
import UserAdminDisplay from './UserAdminDisplay';
import { UserAdminQuery } from './queries.gql';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import useQuerySuspended from '../useQuerySuspended';

function UserBreadcrumbItem({ id }) {
  const { data, error } = useQuerySuspended(UserAdminQuery, { variables: { id } });

  if (error) {
    return null;
  }

  return (
    <BreadcrumbItemWithRoute
      path="/:id"
      to={`/${id}`}
      pageTitleIfActive={data.user.name}
    >
      {data.user.name}
    </BreadcrumbItemWithRoute>
  );
}

UserBreadcrumbItem.propTypes = {
  id: PropTypes.number.isRequired,
};

function UsersAdmin({ basename, exportUrl }) {
  return (
    <BrowserRouter basename={basename}>
      <ol className="breadcrumb">
        <BreadcrumbItemWithRoute
          path="/"
          to="/"
          active={({ match }) => match.isExact}
          pageTitleIfActive="Users"
        >
          Users
        </BreadcrumbItemWithRoute>

        <Route
          path="/:id"
          render={({ match: { params: { id } } }) => (
            <UserBreadcrumbItem id={Number.parseInt(id, 10)} />
          )}
        />
      </ol>

      <Switch>
        <Route path="/:id" render={({ match: { params: { id } } }) => <UserAdminDisplay userId={Number.parseInt(id, 10)} />} />
        <Route path="/" render={() => <UsersTable exportUrl={exportUrl} />} />
      </Switch>
    </BrowserRouter>
  );
}

UsersAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default UsersAdmin;
