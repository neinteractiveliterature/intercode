import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';

import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem';
import EditSignup from './EditSignup';
import eventIdRegexp from '../eventIdRegexp';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import SignupsIndex from './SignupsIndex';
import { SignupAdminEventQuery } from './queries.gql';

const SignupAdmin = ({
  runId,
  eventId,
  exportSignupsUrl,
  teamMembersUrl,
}) => (
  <div>
    <QueryWithStateDisplay query={SignupAdminEventQuery} variables={{ eventId }}>
      {({ data }) => (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <BreadcrumbItem to={`/${eventId}`}>
              {data.event.title}
            </BreadcrumbItem>
            <Route path={`/:eventId(${eventIdRegexp})/runs/:runId/admin_signups`}>
              {({ location }) => (
                <BreadcrumbItem
                  active={location.pathname.endsWith('admin_signups')}
                  to={`/${eventId}/runs/${runId}/admin_signups?filters.state=confirmed%2Cwaitlisted&sort.id=asc`}
                >
                  Signups
                </BreadcrumbItem>
              )}
            </Route>
            <Route
              path={`/:eventId(${eventIdRegexp})/runs/:runId/admin_signups/:id/edit`}
              render={() => (
                <li className="breadcrumb-item active">
                  Edit signup
                </li>
              )}
            />
          </ol>
        </nav>
      )}
    </QueryWithStateDisplay>

    <Switch>
      <Route path={`/:eventId(${eventIdRegexp})/runs/:runId/admin_signups/:id/edit`} render={({ match }) => <EditSignup id={Number.parseInt(match.params.id, 10)} teamMembersUrl={teamMembersUrl} />} />
      <Route
        path={`/:eventId(${eventIdRegexp})/runs/:runId/admin_signups`}
        render={() => (
          <SignupsIndex runId={runId} eventId={eventId} exportSignupsUrl={exportSignupsUrl} />
        )}
      />
    </Switch>
  </div>
);

SignupAdmin.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  exportSignupsUrl: PropTypes.string.isRequired,
  teamMembersUrl: PropTypes.string.isRequired,
};

export default SignupAdmin;
