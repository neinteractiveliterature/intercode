import React from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import UsersTable from './UsersTable';
import UserAdminDisplay from './UserAdminDisplay';
import { UserAdminQuery } from './queries.gql';
import LoadingIndicator from '../LoadingIndicator';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';

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
    <BreadcrumbItem active>{data.user.name}</BreadcrumbItem>
  );
}

function UsersAdmin() {
  return (
    <>
      <ol className="breadcrumb">
        <RouteActivatedBreadcrumbItem matchProps={{ path: '/users', exact: true }} to="/users">
          Users
        </RouteActivatedBreadcrumbItem>

        <Route path="/users/:id">
          <UserBreadcrumbItem />
        </Route>
      </ol>

      <Switch>
        <Route path="/users/:id"><UserAdminDisplay /></Route>
        <Route path="/users"><UsersTable exportUrl="/users/export.csv" /></Route>
      </Switch>
    </>
  );
}

export default UsersAdmin;
