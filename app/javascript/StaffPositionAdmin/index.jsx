import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import BreadcrumbItemWithRoute from '../Breadcrumbs/BreadcrumbItemWithRoute';
import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import { StaffPositionsQuery } from './queries.gql';
import StaffPositionsTable from './StaffPositionsTable';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';

function StaffPositionAdmin({ basename }) {
  const { data, error } = useQuerySuspended(StaffPositionsQuery);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const findStaffPosition = id => data.convention.staff_positions
    .find(sp => sp.id.toString(10) === id);

  return (
    <BrowserRouter basename={basename}>
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <BreadcrumbItemWithRoute
              path="/"
              to="/"
              exact
              pageTitleIfActive="Staff positions"
            >
              Staff positions
            </BreadcrumbItemWithRoute>

            <BreadcrumbItemWithRoute
              path="/new"
              to="/new"
              pageTitleIfActive="New staff position"
              hideUnlessMatch
            >
              New staff position
            </BreadcrumbItemWithRoute>

            <BreadcrumbItemWithRoute
              path="/:id/edit"
              to={({ match }) => `/${match.params.id}/edit`}
              pageTitleIfActive="Edit staff position settings"
              hideUnlessMatch
            >
              Edit settings
            </BreadcrumbItemWithRoute>

            <BreadcrumbItemWithRoute
              path="/:id/edit_permissions"
              to={({ match }) => `/${match.params.id}/edit_permissions`}
              pageTitleIfActive="Edit staff position permissions"
              hideUnlessMatch
            >
              Edit permissions
            </BreadcrumbItemWithRoute>
          </ol>
        </nav>

        <Switch>
          <Route path="/new" component={NewStaffPosition} />
          <Route
            path="/:id/edit"
            render={({ match: { params: { id } } }) => (
              <EditStaffPosition initialStaffPosition={findStaffPosition(id)} />
            )}
          />
          <Route
            path="/:id/edit_permissions"
            render={({ match: { params: { id } } }) => (
              <EditStaffPositionPermissions
                staffPosition={findStaffPosition(id)}
                eventCategories={data.convention.event_categories}
              />
            )}
          />
          <Route
            path="/"
            render={() => (
              <StaffPositionsTable
                staffPositions={data.convention.staff_positions}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </>
    </BrowserRouter>
  );
}

StaffPositionAdmin.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default StaffPositionAdmin;
