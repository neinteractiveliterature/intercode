import React from 'react';
import {
  Switch, Route, useRouteMatch, useParams,
} from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import UsersTable from './UsersTable';
import UserAdminDisplay from './UserAdminDisplay';
import { UserAdminQuery } from './queries.gql';
import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import LoadingIndicator from '../LoadingIndicator';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';

function UserBreadcrumbItem() {
  const id = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(UserAdminQuery, { variables: { id } });

  if (loading) {
    return <BreadcrumbItem active><LoadingIndicator /></BreadcrumbItem>;
  }

  if (error) {
    return null;
  }

  return (
    <BreadcrumbItemWithRoute path="/users/:id" to={`/users/${id}`}>
      {data.user.name}
    </BreadcrumbItemWithRoute>
  );
}

function UsersAdmin() {
  const rootMatch = useRouteMatch({ path: '/users', exact: true });

  return (
    <>
      <ol className="breadcrumb">
        <BreadcrumbItem to="/users" active={!!rootMatch}>
          Users
        </BreadcrumbItem>

        <Route path="/users/:id">
          <UserBreadcrumbItem />
        </Route>
      </ol>

      <Switch>
        <Route path="/users/:id" render={({ match: { params: { id } } }) => <UserAdminDisplay userId={Number.parseInt(id, 10)} />} />
        <Route path="/users" render={() => <UsersTable exportUrl="/users/export.csv" />} />
      </Switch>
    </>
  );
}

export default UsersAdmin;
