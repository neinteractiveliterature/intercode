import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useQuery } from 'react-apollo-hooks';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import { StaffPositionsQuery } from './queries.gql';
import StaffPositionsTable from './StaffPositionsTable';
import ErrorDisplay from '../ErrorDisplay';
import PageLoadingIndicator from '../PageLoadingIndicator';

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
          <BreadcrumbItemWithRoute
            path="/staff_positions"
            to="/staff_positions"
            exact
          >
            Staff positions
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/staff_positions/new"
            to="/staff_positions/new"
            hideUnlessMatch
          >
            New staff position
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/staff_positions/:id/edit"
            to={({ match }) => `/${match.params.id}/edit`}
            hideUnlessMatch
          >
            Edit settings
          </BreadcrumbItemWithRoute>

          <BreadcrumbItemWithRoute
            path="/staff_positions/:id/edit_permissions"
            to={({ match }) => `/${match.params.id}/edit_permissions`}
            hideUnlessMatch
          >
            Edit permissions
          </BreadcrumbItemWithRoute>
        </ol>
      </nav>

      <Switch>
        <Route path="/staff_positions/new" component={NewStaffPosition} />
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
