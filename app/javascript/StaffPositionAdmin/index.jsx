import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import { StaffPositionsQuery } from './queries.gql';
import StaffPositionsTable from './StaffPositionsTable';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem';
import RouteActivatedBreadcrumbItem from '../Breadcrumbs/RouteActivatedBreadcrumbItem';

function StaffPositionAdmin() {
  const { data, loading, error } = useQuery(StaffPositionsQuery);

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const findStaffPosition = (id) => data.convention.staff_positions
    .find((sp) => sp.id.toString(10) === id);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <RouteActivatedBreadcrumbItem
            matchProps={{ path: '/staff_positions', exact: true }}
            to="/staff_positions"
          >
            Staff positions
          </RouteActivatedBreadcrumbItem>

          <Route path="/staff_positions/new">
            <BreadcrumbItem active>New staff position</BreadcrumbItem>
          </Route>

          <Route path="/staff_positions/:id/edit">
            <BreadcrumbItem active>Edit settings</BreadcrumbItem>
          </Route>

          <Route path="/staff_positions/:id/edit_permissions">
            <BreadcrumbItem active>Edit permissions</BreadcrumbItem>
          </Route>
        </ol>
      </nav>

      <Switch>
        <Route path="/staff_positions/new"><NewStaffPosition /></Route>
        <Route
          path="/staff_positions/:id/edit"
          render={({ match: { params: { id } } }) => (
            <EditStaffPosition initialStaffPosition={findStaffPosition(id)} />
          )}
        />
        <Route
          path="/staff_positions/:id/edit_permissions"
          render={({ match: { params: { id } } }) => (
            <EditStaffPositionPermissions
              staffPosition={findStaffPosition(id)}
              convention={data.convention}
            />
          )}
        />
        <Route
          path="/staff_positions"
          render={() => (
            <StaffPositionsTable
              staffPositions={data.convention.staff_positions}
            />
          )}
        />
        <Redirect to="/staff_positions" />
      </Switch>
    </>
  );
}

export default StaffPositionAdmin;
